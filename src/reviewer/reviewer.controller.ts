import {
  Body,
  Controller,
  Query,
  Get, Post, Put, Delete,
  HttpStatus,
  Param,
  Res, Req,
  Version,
} from '@nestjs/common';
import { CorrelationService } from '@evanion/nestjs-correlation-id';
import { Logger } from '@nestjs/common';

import { CreateReviewerDto } from '../dto/create-reviewer.dto';
import { UpdateReviewerDto } from '../dto/update-reviewer.dto';
import { ReviewerService } from './reviewer.service';

@Controller('reviewer')
export class ReviewerController {
  private readonly logger = new Logger(ReviewerController.name);

  constructor(
    private readonly correlationService: CorrelationService,
    private readonly service: ReviewerService,
  ) {}

  @Post('/bulk')
  @Version('1')
  async upsertBulk(
    @Res() response,
    @Body() createDtos: CreateReviewerDto[],
  ) {
    try {
      const data = await this.service.upsertBulk(createDtos);

      return response.status(HttpStatus.CREATED).json({
        data,
      });
    } catch (err) {
      this.logger.error(err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Reviewer not created!',
        error: 'Bad Request'
      });
    }
  }

  @Post()
  @Version('1')
  async create(
    @Req() req,
    @Res() response,
    @Body() createDto: CreateReviewerDto,
  ) {
    const correlationId = await this.correlationService.getCorrelationId();

    try {
      this.logger.log(JSON.stringify({ correlationId, data: req.originalUrl }));

      const data = await this.service.create(correlationId, createDto);
      return response.status(HttpStatus.CREATED).json({ data });
    } catch (err) {
      this.logger.error(err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Reviewer not created!',
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
    @Body() updateDto: UpdateReviewerDto,
  ) {
    const correlationId = await this.correlationService.getCorrelationId();

    try {
      this.logger.log(JSON.stringify({ correlationId, data: req.originalUrl }));

      const data = await this.service.update(correlationId, id, updateDto);

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      this.logger.error(err);
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  @Version('1')
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
      this.logger.error(err);
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
      this.logger.error(err);
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
      this.logger.error(err);
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
      this.logger.error(err);
      return response.status(err.status).json(err.response);
    }
  }
}
