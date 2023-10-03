import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, HydratedDocument } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';

export type ReviewerDocument = HydratedDocument<Review>;

@Schema()
export class Review {
  @Prop({ type: Types.ObjectId , ref: 'Company', index: true })
  company:  Types.ObjectId;

  @Prop({ type: Types.ObjectId , ref: 'Reviewer', index: true })
  manager:  Types.ObjectId;

  @Prop({ type: Types.ObjectId , ref: 'Reviewer', index: true })
  reviewer:  Types.ObjectId;

  @Prop({ type: Number, required: false })
  rating: number;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: String, enum: StatusEnum, default: StatusEnum.pending, required: false })
  status: StatusEnum;

  @Prop({ type: Date, required: false, default: Date.now })
  createdOn: Date;

  @Prop({ type: Date, required: false, default: Date.now })
  updatedOn: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
