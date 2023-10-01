import { IsOptional, IsEnum, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform , Type } from 'class-transformer';
import { Types } from 'mongoose';
import { StatusEnum } from '../enums/status.enum';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsString()
  logo: string;

  @IsOptional()
  @IsString()
  industry: string;

  @IsOptional()
  @IsString()
  website: string;

  @IsOptional()
  @IsString()
  linkedin: string;

  @IsOptional()
  @IsString()
  facebook: string;

  @IsOptional()
  @IsString()
  twitter: string;

  @IsOptional()
  @IsString()
  headquarter: string;

  @IsOptional()
  @IsString()
  size: string;

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
