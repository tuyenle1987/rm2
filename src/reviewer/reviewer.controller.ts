import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, Version } from '@nestjs/common';
import { CreateReviewerDto } from '../dto/create-reviewer.dto';
import { UpdateReviewerDto } from '../dto/update-reviewer.dto';
import { ReviewerService } from './reviewer.service';

@Controller('reviewer')
export class ReviewerController {
  constructor(private readonly reviewerService: ReviewerService) {}

  @Post()
  @Version('1')
  async create(
    @Res() response,
    @Body() createDto: CreateReviewerDto,
  ) {
    try {
      const data = await this.reviewerService.create(createDto);
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
      const data = await this.reviewerService.update(id, updateDto);

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
      const data = await this.reviewerService.getAll();

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
      const data = await this.reviewerService.get(id);

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
      const data = await this.reviewerService.delete(id);

      return response.status(HttpStatus.OK).json({
        data,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
