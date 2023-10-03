import { Body, Query, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, Version } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly service: ReviewService) {}

  @Post()
  @Version('1')
  async create(
    @Res() response,
    @Body() createDto: CreateReviewDto,
  ) {
    try {
      const data = await this.service.create(createDto);
      return response.status(HttpStatus.CREATED).json({ data });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Review not created!',
        error: 'Bad Request'
      });
    }
  }

  @Put('/:id')
  @Version('1')
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() updateDto: UpdateReviewDto,
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

  @Get('/search')
  @Version('1')
  async search(
    @Res() response,
    @Query('company') company: string,
    @Query('manager') manager: string,
  ) {
    try {
      const data = await this.service.search({ company, manager });
      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  @Version('1')
  async get(
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
