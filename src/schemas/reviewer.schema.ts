import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, HydratedDocument } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';

export type ReviewerDocument = HydratedDocument<Reviewer>;

@Schema()
export class Reviewer {
 @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: String, required: false })
  image: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  company: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  linkedin: string;

  @Prop({ type: String, enum: StatusEnum, default: StatusEnum.pending, required: false })
  status: StatusEnum;

  @Prop({ type: Date, required: false, default: Date.now })
  createdOn: Date;

  @Prop({ type: Date, required: false, default: Date.now })
  updatedOn: Date;
}

export const ReviewerSchema = SchemaFactory.createForClass(Reviewer);
