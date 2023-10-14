import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';
import { Model } from "mongoose";

import { IPending } from '../interface/pending.interface';
import { CreatePendingDto } from '../dto/create-pending.dto';
import { StatusEnum } from '../enums/status.enum';
import { ReviewerService } from '../reviewer/reviewer.service';

@Injectable()
export class PendingService {
  private readonly logger = new Logger(PendingService.name);

  constructor(
    private readonly reviewerService: ReviewerService,
    @InjectModel('Pending') private pendingModel:Model<IPending>
  ) {}

  async create(
    correlationId: string,
    createPendingDto: CreatePendingDto,
    user: any,
  ): Promise<IPending> {
    let reviewer = null;

    // Validate Reviewer
    let reviewerData = await this.reviewerService.getByEmail(correlationId, user.email);
    if (!reviewerData) {
      const upsertData = await this.reviewerService.upsertBulk([{
        name: user.name,
        image: user.picture,
        email: user.email,
        description: null,
        theorgSlug: null,
        theorgId: null,
        company: null,
        title: null,
        linkedin: null,
      }]);
      reviewerData = await this.reviewerService.getByEmail(correlationId, user.email);
    }
    reviewer = reviewerData._id;
    this.logger.log(JSON.stringify({ correlationId, data: reviewerData }));
    if (!reviewerData) {
      throw new NotFoundException(`Reviewer #${reviewer} not found`);
    }

    createPendingDto.reviewer = reviewer;

    const data = await new this.pendingModel(createPendingDto);
    data.status = StatusEnum.pending;
    this.logger.log(JSON.stringify({ correlationId, data }));

    return data.save();
  }
}
