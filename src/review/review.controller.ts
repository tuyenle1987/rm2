import {
  Body,
  Controller,
  Query,
  Get, Post, Put, Delete,
  HttpStatus,
  Param,
  Res, Req,
  Version,
  UseGuards,
} from '@nestjs/common';
import { CorrelationService } from '@evanion/nestjs-correlation-id';
import { Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);

  constructor(
    private readonly correlationService: CorrelationService,
    private readonly service: ReviewService,
  ) {}

  @Post()
  @Version('1')
  @UseGuards(AuthGuard())
  async create(
    @Req() req,
    @Res() response,
    @Body() createDto: CreateReviewDto,
  ) {
    const correlationId = await this.correlationService.getCorrelationId();

    try {
      this.logger.log(JSON.stringify({ correlationId, data: req.originalUrl, user: req.user }));

      const data = await this.service.create(correlationId, createDto, req.user);
      return response.status(HttpStatus.CREATED).json({ data });
    } catch (err) {
      let statusCode = 400;
      if (err.message.includes('Review already existed')) {
        statusCode = 409;
      }
      this.logger.error(JSON.stringify({ correlationId, err: err.stack }));
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode,
        message: err.message,
        error: 'Bad Request'
      });
    }
  }

  @Put('/:id')
  @Version('1')
  @UseGuards(AuthGuard('noway'))
  async update(
    @Req() req,
    @Res() response,
    @Param('id') id: string,
    @Body() updateDto: UpdateReviewDto,
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
    @Query('company') company: string,
    @Query('manager') manager: string,
  ) {
    const correlationId = await this.correlationService.getCorrelationId();

    try {
      this.logger.log(JSON.stringify({ correlationId, data: req.originalUrl }));

      const data = await this.service.search({ correlationId, company, manager });
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
  @UseGuards(AuthGuard('noway'))
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
