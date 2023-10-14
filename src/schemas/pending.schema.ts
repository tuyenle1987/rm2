
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';

export type PendingDocument = HydratedDocument<Pending>;

@Schema()
export class Pending {
  @Prop({ type: String, required: true, index: true })
  company_name: string;

  @Prop({ type: String, required: false, index: true })
  company_website: string;

  @Prop({ type: String, required: true, index: true })
  manager_name: string;

  @Prop({ type: String, required: true, index: true })
  manager_title: string;

  @Prop({ type: Number, required: false })
  rating: number;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: Types.ObjectId , ref: 'Reviewer', index: true })
  reviewer:  Types.ObjectId;

  @Prop({ type: String, enum: StatusEnum, default: StatusEnum.pending, required: false, index: true })
  status: StatusEnum;

  @Prop({ type: Date, required: false, default: Date.now })
  createdOn: Date;

  @Prop({ type: Date, required: false, default: Date.now })
  updatedOn: Date;
}

export const PendingSchema = SchemaFactory.createForClass(Pending);
