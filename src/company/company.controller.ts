import {
  Body,
  Controller,
  Query,
  Get, Post, Put, Delete,
  HttpStatus,
  Param,
  Res, Req,
  Version,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { CorrelationService } from '@evanion/nestjs-correlation-id';
import { AuthGuard } from '@nestjs/passport';

import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  private readonly logger = new Logger(CompanyController.name);

  constructor(
    private readonly correlationService: CorrelationService,
    private readonly service: CompanyService,
  ) {}

  @Post('/bulk')
  @Version('1')
  async upsertBulk(
    @Res() response,
    @Body() createDtos: CreateCompanyDto[],
  ) {
    try {
      const data = await this.service.upsertBulk(createDtos);

      return response.status(HttpStatus.CREATED).json({
        data,
      });
    } catch (err) {
      this.logger.error(JSON.stringify({ err: err.stack }));
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Company not created!',
        error: 'Bad Request'
      });
    }
  }

  @Post()
  @Version('1')
  async create(
    @Req() req,
    @Res() response,
    @Body() createDto: CreateCompanyDto,
  ) {
    const correlationId = await this.correlationService.getCorrelationId();

    try {
      this.logger.log(JSON.stringify({ correlationId, data: req.originalUrl }));

      const data = await this.service.create(correlationId, createDto);

      return response.status(HttpStatus.CREATED).json({
        data,
      });
    } catch (err) {
      this.logger.error(JSON.stringify({ correlationId, err: err.stack }));
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Company not created!',
        error: 'Bad Request'
      });
    }
  }

  @Put('/:id')
  @Version('1')
  async update(
    @Req() req,
    @Res() response,
    @Param('id') id: string,
    @Body() updateDto: UpdateCompanyDto,
  ) {
    const correlationId = await this.correlationService.getCorrelationId();

    try {
      this.logger.log(JSON.stringify({ correlationId, data: req.originalUrl }));
      const data = await this.service.update(correlationId, id, updateDto);

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      this.logger.error(JSON.stringify({ correlationId, err: err.stack }));
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  @Version('1')
  // @UseGuards(AuthGuard('jwt'))
  async getAll(
    @Req() req,
    @Res() response,
  ) {
    const correlationId = await this.correlationService.getCorrelationId();

    try {
      this.logger.log(JSON.stringify({ correlationId, data: req.originalUrl }));
      const data = await this.service.getAll(correlationId);

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      this.logger.error(JSON.stringify({ correlationId, err: err.stack }));
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/search')
  @Version('1')
  async search(
    @Req() req,
    @Res() response,
    @Query('name') name: string,
  ) {
    const correlationId = await this.correlationService.getCorrelationId();

    try {
      this.logger.log(JSON.stringify({ correlationId, data: req.originalUrl }));
      const data = await this.service.search({ correlationId, name });
      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      this.logger.error(JSON.stringify({ correlationId, err: err.stack }));
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  @Version('1')
  async get(
    @Req() req,
    @Res() response,
    @Param('id') id: string,
  ) {
    const correlationId = await this.correlationService.getCorrelationId();

    try {
      this.logger.log(JSON.stringify({ correlationId, data: req.originalUrl }));
      const data = await this.service.get(correlationId, id);

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      this.logger.error(JSON.stringify({ correlationId, err: err.stack }));
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  @Version('1')
  async delete(
    @Res() response,
    @Param('id') id: string,
  ) {
    try {
      const data = await this.service.delete(id);

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      this.logger.error(JSON.stringify({ err: err.stack }));
      return response.status(err.status).json(err.response);
    }
  }
}
