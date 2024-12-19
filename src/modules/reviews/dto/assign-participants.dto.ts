import {
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class AssignParticipantsDto {
  @IsNotEmpty()
  @IsNumber()
  reviewID: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  employeeIds: number[];
}
