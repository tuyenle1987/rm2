import { IsOptional, IsEnum, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform , Type} from 'class-transformer';
import { StatusEnum } from '../enums/status.enum';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

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
  headquarter: string;

  @IsOptional()
  @IsNumber()
  size: string;

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
