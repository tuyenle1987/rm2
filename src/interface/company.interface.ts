import { Document } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';

export interface ICompany extends Document {
  readonly name: string;
  readonly theorgSlug: string;
  readonly theorgId: string;
  readonly logo: string;
  readonly description: string;
  readonly stage: string;
  readonly industry: string;
  readonly website: string;
  readonly linkedin: string;
  readonly facebook: string;
  readonly twitter: string;
  readonly headquarter: string;
  readonly size: string;
  readonly createdOn: Date;
  readonly updatedOn: Date;
  status: StatusEnum;
}
