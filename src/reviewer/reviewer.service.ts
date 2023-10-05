import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";

import { IReviewer } from '../interface/reviewer.interface';
import { CreateReviewerDto } from '../dto/create-reviewer.dto';
import { UpdateReviewerDto } from '../dto/update-reviewer.dto';
import { StatusEnum } from '../enums/status.enum';

@Injectable()
export class ReviewerService {
  constructor(@InjectModel('Reviewer') private reviewerModel:Model<IReviewer>) {}

  async upsertBulk(
    createReviewerDtos: CreateReviewerDto[],
  ): Promise<any> {

    let newData = createReviewerDtos.map((createReviewerDto: CreateReviewerDto) => {
      return {
        updateOne: {
          filter: {
            name: createReviewerDto.name,
            company: createReviewerDto.company,
          },
          update: createReviewerDto,
          upsert: true,
        },
      }
    });

    const data = await this.reviewerModel.bulkWrite(newData, { ordered: false });
    return data;
  }

  async create(
    createReviewerDto: CreateReviewerDto,
  ): Promise<IReviewer> {
    const data = await new this.reviewerModel(createReviewerDto);
    return data.save();
  }

  async update(
    id: string,
    updateReviewerDto: UpdateReviewerDto,
  ): Promise<IReviewer> {
    const data = await this.reviewerModel.findByIdAndUpdate(id, updateReviewerDto, { new: true });
    if (!data) {
      throw new NotFoundException(`Reviewer #${id} not found`);
    }

    return data;
  }

  async search({ name }: { name: string }): Promise<IReviewer[]> {
    const term = name.toLowerCase().split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join (' ');

    const data = await this.reviewerModel.find({ name: { $regex: `^${term}`, $options: 'i' }}).limit(20);
    if (!data || data.length == 0) {
      throw new NotFoundException('Reviewers data not found!');
    }

    return data;
  }

  async getAll(): Promise<IReviewer[]> {
    const data = await this.reviewerModel.find({ status: StatusEnum.approved }).limit(50);
    if (!data || data.length == 0) {
        throw new NotFoundException('Reviewers data not found!');
    }

    return data;
  }

  async get(id: string): Promise<IReviewer> {
    const data = await this.reviewerModel.findById(id).exec();
    if (!data) {
      throw new NotFoundException(`Reviewer #${id} not found`);
    }

    return data;
  }

  async delete(id: string): Promise<IReviewer> {
    const data = await this.reviewerModel.findByIdAndDelete(id);
    if (!data) {
      throw new NotFoundException(`Reviewer #${id} not found`);
    }

    return data;
  }
}
