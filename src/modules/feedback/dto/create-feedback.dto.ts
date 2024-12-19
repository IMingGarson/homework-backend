import { IsNotEmpty, IsInt, IsString, MinLength } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsInt()
  reviewId: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10, {
    message: 'Feedback comments must be at least 10 characters long.',
  })
  comments: string;
}
