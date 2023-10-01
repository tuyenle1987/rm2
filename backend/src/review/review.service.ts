import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";

import { IReview } from '../interface/review.interface';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(@InjectModel('Review') private reviewModel:Model<IReview>) {}

  async create(
    createReviewDto: CreateReviewDto,
  ): Promise<IReview> {
    const data = await new this.reviewModel(createReviewDto);
    return data.save();
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<IReview> {
    const data = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true });
    if (!data) {
      throw new NotFoundException(`Review #${id} not found`);
    }

    return data;
  }

  async getAll(): Promise<IReview[]> {
    const data = await this.reviewModel.find();
    if (!data || data.length == 0) {
        throw new NotFoundException('Reviews data not found!');
    }

    return data;
  }

  async get(id: string): Promise<IReview> {
    const data = await this.reviewModel.findById(id).exec();
    if (!data) {
      throw new NotFoundException(`Review #${id} not found`);
    }

    return data;
  }

  async delete(id: string): Promise<IReview> {
    const data = await this.reviewModel.findByIdAndDelete(id);
    if (!data) {
      throw new NotFoundException(`Review #${id} not found`);
    }

    return data;
  }
}
