import { IsEmail, IsOptional, MinLength, IsEnum } from 'class-validator';
import { Role } from '../../auth/user.entity';

export class UpdateEmployeeDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
