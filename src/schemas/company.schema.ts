
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
export class Company {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  logo: string;

  @Prop({ type: String, required: false })
  industry: string;

  @Prop({ type: String, required: false })
  website: string;

  @Prop({ type: String, required: false })
  headquarter: string;

  @Prop({ type: Number, required: false })
  size: number;

  @Prop({ type: String, enum: StatusEnum, required: false })
  status: StatusEnum;

  @Prop({ type: Date, required: false, default: Date.now })
  createdOn: Date;

  @Prop({ type: Date, required: false, default: Date.now })
  updatedOn: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
