import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { Logger } from '@nestjs/common';

import { IReviewer } from '../interface/reviewer.interface';
import { CreateReviewerDto } from '../dto/create-reviewer.dto';
import { UpdateReviewerDto } from '../dto/update-reviewer.dto';
import { StatusEnum } from '../enums/status.enum';

@Injectable()
export class ReviewerService {
  private readonly logger = new Logger(ReviewerService.name);

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
            email: createReviewerDto.email,
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
    correlationId: string,
    createReviewerDto: CreateReviewerDto,
  ): Promise<IReviewer> {
    const data = await new this.reviewerModel(correlationId, createReviewerDto);
    this.logger.log(JSON.stringify({ correlationId, data }));

    return data.save();
  }

  async update(
    correlationId: string,
    id: string,
    updateReviewerDto: UpdateReviewerDto,
  ): Promise<IReviewer> {
    const data = await this.reviewerModel.findByIdAndUpdate(id, updateReviewerDto, { new: true });
    this.logger.log(JSON.stringify({ correlationId, data }));

    if (!data) {
      throw new NotFoundException(`Reviewer #${id} not found`);
    }

    return data;
  }

  async search(
    { correlationId, name }: { correlationId: string, name: string },
  ): Promise<IReviewer[]> {
    const term = name.toLowerCase().split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join (' ');

    const data = await this.reviewerModel.aggregate([
      {
        $search: {
          index: 'reviewerName',
          autocomplete: {
            query: term,
            path: 'name',
          }
        }
      },
      {
        $limit: 20,
      },
    ]);

    this.logger.log(JSON.stringify({ correlationId, data: data.length }));

    if (!data || data.length == 0) {
      throw new NotFoundException('Reviewers data not found!');
    }

    return data;
  }

  async getAll(correlationId: string): Promise<IReviewer[]> {
    const data = await this.reviewerModel.find({ status: StatusEnum.approved }).limit(50);
    this.logger.log(JSON.stringify({ correlationId, data: data.length }));

    if (!data || data.length == 0) {
        throw new NotFoundException('Reviewers data not found!');
    }

    return data;
  }

  async get(correlationId:string, id: string): Promise<IReviewer> {
    const data = await this.reviewerModel.findById(id).exec();
    this.logger.log(JSON.stringify({ correlationId, data }));
    if (!data) {
      throw new NotFoundException(`Reviewer #${id} not found`);
    }

    return data;
  }

  async getByEmail(correlationId:string, email: string): Promise<IReviewer> {
    const data = await this.reviewerModel.find({ email }).exec();
    this.logger.log(JSON.stringify({ correlationId, data }));
    if (!data) {
      throw new NotFoundException(`Reviewer #${email} not found`);
    }

    return data[0];
  }

  async delete(id: string): Promise<IReviewer> {
    const data = await this.reviewerModel.findByIdAndDelete(id);
    if (!data) {
      throw new NotFoundException(`Reviewer #${id} not found`);
    }

    return data;
  }
}
