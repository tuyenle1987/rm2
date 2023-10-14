import { IsOptional, IsEnum, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform , Type } from 'class-transformer';
import { StatusEnum } from '../enums/status.enum';
import { Types } from 'mongoose';

export class CreateReviewDto {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform( ({ value }) => new Types.ObjectId(value))
  company: Types.ObjectId;

  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform( ({ value }) => new Types.ObjectId(value))
  manager: Types.ObjectId;

  @IsOptional()
  @Type(() => Types.ObjectId)
  @Transform( ({ value }) => new Types.ObjectId(value))
  reviewer: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum = StatusEnum.pending;

  @IsOptional()
  @Transform( ({ value }) => new Date(value))
  @IsDate()
  createdOn?: Date = new Date(new Date().toUTCString());

  @IsOptional()
  @Transform( ({ value }) => new Date(value))
  @IsDate()
  updatedOn?: Date = new Date(new Date().toUTCString());
}
