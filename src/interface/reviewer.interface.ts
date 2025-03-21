import { Document } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';

export interface IReviewer extends Document {
  readonly name: string;
  readonly image: string;
  readonly description: string;
  readonly email: string;
  readonly company: string;
  readonly title: string;
  readonly theorgSlug: string;
  readonly theorgId: string;
  readonly linkedin: string;
  workHistory: any;
  companyHistory: any;
  readonly createdOn: Date;
  readonly updatedOn: Date;
  readonly status: StatusEnum;
}
