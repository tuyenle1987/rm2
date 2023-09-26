import { IsOptional, IsEnum, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform , Type } from 'class-transformer';
import { StatusEnum } from '../enums/status.enum';
import { Types } from 'mongoose';

export class CreateReviewDto {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  company: Types.ObjectId;

  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  manager: Types.ObjectId;

  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  reviewer: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;

  @IsOptional()
  @Transform( ({ value }) => new Date(value))
  @IsDate()
  createdOn?: Date = new Date(new Date().toUTCString());

  @IsOptional()
  @Transform( ({ value }) => new Date(value))
  @IsDate()
  updatedOn?: Date = new Date(new Date().toUTCString());
}
