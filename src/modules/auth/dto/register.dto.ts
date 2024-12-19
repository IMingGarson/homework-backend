import { IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { Role } from '../user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}
