import { Document } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';
import { Types } from 'mongoose';

export interface IReview extends Document {
  readonly company: Types.ObjectId;
  readonly manager: Types.ObjectId;
  reviewer: Types.ObjectId;
  readonly description: string;
  readonly rating: number;
  readonly createdOn: Date;
  readonly updatedOn: Date;
  readonly status: StatusEnum;
}
