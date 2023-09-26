import { Document } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';

export interface ICompany extends Document {
  readonly name: string;
  readonly logo: string;
  readonly industry: string;
  readonly website: string;
  readonly headquarter: string;
  readonly size: number;
  readonly createdOn: Date;
  readonly updatedOn: Date;
  readonly status: StatusEnum;
}
