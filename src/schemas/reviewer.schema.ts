import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, HydratedDocument } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';

export type ReviewerDocument = HydratedDocument<Reviewer>;

@Schema({ _id: false })
export class ReviewerCompanyHistory {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Date, required: false, default: null })
  startDate: Date;

  @Prop({ type: Date, required: false, default: null })
  endDate: Date;
}

@Schema({ _id: false })
export class ReviewerWorkHistory {
  @Prop({ type: String, required: true })
  role: string;

  @Prop({ type: Date, required: false, default: null })
  startDate: Date;

  @Prop({ type: Boolean, required: false })
  isCurrent: boolean;
}

@Schema()
export class Reviewer {
  // https://medium.com/statuscode/how-to-speed-up-mongodb-regex-queries-by-a-factor-of-up-to-10-73995435c606
  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ type: String, required: false, index: true })
  theorgSlug: string;

  @Prop({ type: String, required: false })
  theorgId: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: String, required: false })
  image: string;

  @Prop({ type: String, required: false })
  imageUrl: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true, index: true })
  company: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  linkedin: string;

  @Prop({ type: Array<ReviewerWorkHistory>, required: false })
  workHistory: ReviewerWorkHistory[];

  @Prop({ type: Array<ReviewerCompanyHistory>, required: false })
  companyHistory: ReviewerCompanyHistory[];

  @Prop({ type: String, enum: StatusEnum, default: StatusEnum.pending, required: false })
  status: StatusEnum;

  @Prop({ type: Date, required: false, default: Date.now })
  createdOn: Date;

  @Prop({ type: Date, required: false, default: Date.now })
  updatedOn: Date;
}

export const ReviewerSchema = SchemaFactory.createForClass(Reviewer);
