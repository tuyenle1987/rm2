import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, HydratedDocument } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';

export type ReviewerDocument = HydratedDocument<Reviewer>;

@Schema()
export class Reviewer {
  @Prop({ type: Types.ObjectId , ref: 'Company' })
  company:  Types.ObjectId;

  @Prop({ type: Types.ObjectId , ref: 'Reviewer' })
  manager:  Types.ObjectId;

  @Prop({ type: Types.ObjectId , ref: 'Reviewer' })
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

export const ReviewerSchema = SchemaFactory.createForClass(Reviewer);
