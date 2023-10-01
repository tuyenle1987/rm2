import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, Version } from '@nestjs/common';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @Version('1')
  async create(
    @Res() response,
    @Body() createDto: CreateReviewDto,
  ) {
    try {
      const data = await this.reviewService.create(createDto);
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
      const data = await this.reviewService.update(id, updateDto);

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
      const data = await this.reviewService.getAll();

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  @Version('1')
  async getReview(
    @Res() response,
    @Param('id') id: string,
  ) {
    try {
      const data = await this.reviewService.get(id);

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
      const data = await this.reviewService.delete(id);

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
