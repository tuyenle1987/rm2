import { IsOptional, IsEnum, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform , Type } from 'class-transformer';
import { StatusEnum } from '../enums/status.enum';
import { Types } from 'mongoose';

export class CreatePendingDto {
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @IsOptional()
  @IsString()
  company_website: string;

  @IsNotEmpty()
  @IsString()
  manager_name: string;

  @IsNotEmpty()
  @IsString()
  manager_title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsOptional()
  @Type(() => Types.ObjectId)
  @Transform( ({ value }) => new Types.ObjectId(value))
  reviewer: Types.ObjectId;

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
