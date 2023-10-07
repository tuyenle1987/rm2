
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
export class Company {
  @Prop({ type: String, required: true, index: true })
  name: string;

  @Prop({ type: String, required: false, index: true })
  theorgSlug: string;

  @Prop({ type: String, required: false })
  theorgId: string;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: String, required: false })
  logo: string;

  @Prop({ type: String, required: false })
  logoUrl: string;

  @Prop({ type: String, required: false })
  stage: string;

  @Prop({ type: String, required: false })
  industry: string;

  @Prop({ type: String, required: false })
  website: string;

  @Prop({ type: String, required: false })
  linkedin: string;

  @Prop({ type: String, required: false })
  facebook: string;

  @Prop({ type: String, required: false })
  twitter: string;

  @Prop({ type: String, required: false })
  headquarter: string;

  @Prop({ type: String, required: false })
  size: string;

  @Prop({ type: String, enum: StatusEnum, default: StatusEnum.pending, required: false })
  status: StatusEnum;

  @Prop({ type: Date, required: false, default: Date.now })
  createdOn: Date;

  @Prop({ type: Date, required: false, default: Date.now })
  updatedOn: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
