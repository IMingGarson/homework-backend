import { IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ReviewStatus } from '../review.entity';

export class CreateReviewDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  employeeId: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;
}
