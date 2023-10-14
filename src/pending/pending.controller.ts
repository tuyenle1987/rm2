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

import { CreatePendingDto } from '../dto/create-pending.dto';
import { PendingService } from './pending.service';

@Controller('pending')
export class PendingController {
  private readonly logger = new Logger(PendingController.name);

  constructor(
    private readonly correlationService: CorrelationService,
    private readonly service: PendingService,
  ) {}

  @Post()
  @Version('1')
  @UseGuards(AuthGuard())
  async create(
    @Req() req,
    @Res() response,
    @Body() createDto: CreatePendingDto,
  ) {
    const correlationId = await this.correlationService.getCorrelationId();

    try {
      this.logger.log(JSON.stringify({ correlationId, data: req.originalUrl, user: req.user }));

      const data = await this.service.create(correlationId, createDto, req.user);

      return response.status(HttpStatus.CREATED).json({
        data,
      });
    } catch (err) {
      this.logger.error(JSON.stringify({ correlationId, err: err.stack }));
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Subject To Approval Review not created!',
        error: 'Bad Request'
      });
    }
  }
}
