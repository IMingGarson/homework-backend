import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { Role } from '../../auth/user.entity';

export class CreateEmployeeDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
