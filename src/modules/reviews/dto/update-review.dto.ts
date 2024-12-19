import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ReviewStatus } from '../review.entity';

export class UpdateReviewDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;
}
