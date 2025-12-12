import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MaxLength(128, { message: 'Password must be at most 128 characters long' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'Nickname must be at least 2 characters long' })
  @MaxLength(50, { message: 'Nickname must be at most 50 characters long' })
  nickname: string;
}
