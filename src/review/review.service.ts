import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from "mongoose";
import { Logger } from '@nestjs/common';

import { IReview } from '../interface/review.interface';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ICompany } from '../interface/company.interface';
import { IReviewer } from '../interface/reviewer.interface';
import { StatusEnum } from '../enums/status.enum';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    @InjectModel('Company') private companyModel:Model<ICompany>,
    @InjectModel('Reviewer') private reviewerModel:Model<IReviewer>,
    @InjectModel('Review') private reviewModel:Model<IReview>,
  ) {}

  async create(
    correlationId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<IReview> {
    const { company, manager, reviewer } = createReviewDto;

    createReviewDto.status = StatusEnum.pending;

    // Validate Company
    const companyData = await this.companyModel.findById(company).exec();
    this.logger.log(JSON.stringify({ correlationId, data: companyData }));
    if (!companyData) {
      throw new NotFoundException(`Company #${company} not found`);
    }

    // Validate Manager
    const managerData = await this.reviewerModel.findById(manager).exec();
    this.logger.log(JSON.stringify({ correlationId, data: managerData }));
    if (!managerData) {
      throw new NotFoundException(`Manager #${manager} not found`);
    }

    // Validate Reviewer
    const reviewerData = await this.reviewerModel.findById(reviewer).exec();
    this.logger.log(JSON.stringify({ correlationId, data: reviewerData }));
    if (!reviewerData) {
      throw new NotFoundException(`Reviewer #${reviewer} not found`);
    }

    // Validate Review
    // const reviewData = await this.reviewModel.find({ company, manager, reviewer }).exec();
    // this.logger.log(JSON.stringify({ correlationId, data: reviewData }));
    // if (reviewData && reviewData.length > 0) {
    //   throw new Error(`Review already existed ${company} - ${manager} - ${reviewer}`);
    // }

    const data = await new this.reviewModel(createReviewDto);
    this.logger.log(JSON.stringify({ correlationId, data }));

    return data.save();
  }

  async update(
    correlationId: string,
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<IReview> {
    const data = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true });
    this.logger.log(JSON.stringify({ correlationId, data }));

    if (!data) {
      throw new NotFoundException(`Review #${id} not found`);
    }

    return data;
  }

  async search(
    { correlationId, company, manager }: { correlationId: string, company: string, manager: string }
  ): Promise<IReview[]> {
    const data = await this.reviewModel.find({
      company: new Types.ObjectId(company),
      manager: new Types.ObjectId(manager),
      status: StatusEnum.approved,
    }).limit(50);
    this.logger.log(JSON.stringify({ correlationId, data: data.length }));

    if (!data || data.length == 0) {
      throw new NotFoundException('Reviews data not found!');
    }

    return data;
  }

  async getAll(correlationId: string): Promise<IReview[]> {
    const data = await this.reviewModel.find({ status: StatusEnum.approved }).limit(50);
    this.logger.log(JSON.stringify({ correlationId, data: data.length }));

    if (!data || data.length == 0) {
      throw new NotFoundException('Reviews data not found!');
    }

    return data;
  }

  async get(correlationId: string, id: string): Promise<IReview> {
    const data = await this.reviewModel.findById(id).exec();
    this.logger.log(JSON.stringify({ correlationId, data }));

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
