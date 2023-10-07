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

import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);

  constructor(
    private readonly correlationService: CorrelationService,
    private readonly service: HistoryService,
  ) {}

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
}
