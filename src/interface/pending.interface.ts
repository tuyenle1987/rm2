import { Document } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';
import { Types } from 'mongoose';

export interface IPending extends Document {
  readonly company_name: string;
  readonly company_website: string;
  readonly manager_name: string;
  readonly manager_title: string;
  readonly description: string;
  readonly rating: number;
  readonly createdOn: Date;
  readonly updatedOn: Date;
  status: StatusEnum;
}
