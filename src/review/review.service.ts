import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from "mongoose";

import { IReview } from '../interface/review.interface';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ICompany } from '../interface/company.interface';
import { IReviewer } from '../interface/reviewer.interface';
import { StatusEnum } from '../enums/status.enum';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Company') private companyModel:Model<ICompany>,
    @InjectModel('Reviewer') private reviewerModel:Model<IReviewer>,
    @InjectModel('Review') private reviewModel:Model<IReview>,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
  ): Promise<IReview> {
    const { company, manager, reviewer } = createReviewDto;

    // Validate Company
    const companyData = await this.companyModel.findById(company).exec();
    if (!companyData) {
      throw new NotFoundException(`Company #${company} not found`);
    }

    // Validate Manager
    const managerData = await this.reviewerModel.findById(manager).exec();
    if (!managerData) {
      throw new NotFoundException(`Manager #${manager} not found`);
    }

    // Validate Reviewer
    const reviewerData = await this.reviewerModel.findById(reviewer).exec();
    if (!reviewerData) {
      throw new NotFoundException(`Reviewer #${reviewer} not found`);
    }

    // Validate Review
    // const reviewData = await this.reviewModel.find({ company, manager, reviewer }).exec();
    // if (reviewData && reviewData.length > 0) {
    //   throw new Error(`Review already existed ${company} - ${manager} - ${reviewer}`);
    // }

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

  async search(
    { company, manager }: { company: string, manager: string }
  ): Promise<IReview[]> {
    const data = await this.reviewModel.find({
      company: new Types.ObjectId(company),
      manager: new Types.ObjectId(manager),
      status: StatusEnum.approved,
    }).limit(50);

    if (!data || data.length == 0) {
      throw new NotFoundException('Reviews data not found!');
    }

    return data;
  }

  async getAll(): Promise<IReview[]> {
    const data = await this.reviewModel.find({ status: StatusEnum.approved }).limit(50);
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
