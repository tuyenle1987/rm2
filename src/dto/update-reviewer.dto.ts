import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewerDto } from './create-reviewer.dto';

export class UpdateReviewerDto extends PartialType(CreateReviewerDto) {}
