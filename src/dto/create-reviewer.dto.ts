import { IsOptional, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform , Type } from 'class-transformer';
import { StatusEnum } from '../enums/status.enum';

export class CreateReviewerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  linkedin: string;

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
