import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, Version } from '@nestjs/common';
import { CreateReviewerDto } from '../dto/create-reviewer.dto';
import { UpdateReviewerDto } from '../dto/update-reviewer.dto';
import { ReviewerService } from './reviewer.service';

@Controller('reviewer')
export class ReviewerController {
  constructor(private readonly service: ReviewerService) {}

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
    @Res() response,
    @Body() createDto: CreateReviewerDto,
  ) {
    try {
      const data = await this.service.create(createDto);
      return response.status(HttpStatus.CREATED).json({ data });
    } catch (err) {
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
    @Res() response,
    @Param('id') id: string,
    @Body() updateDto: UpdateReviewerDto,
  ) {
    try {
      const data = await this.service.update(id, updateDto);

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get()
  @Version('1')
  async getAll(@Res() response) {
    try {
      const data = await this.service.getAll();

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  @Version('1')
  async getReviewer(
    @Res() response,
    @Param('id') id: string,
  ) {
    try {
      const data = await this.service.get(id);

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
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
      return response.status(err.status).json(err.response);
    }
  }
}
