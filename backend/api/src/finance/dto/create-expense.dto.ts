import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Length, MaxLength } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @Length(3, 3)
  currency: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  splitBetween: string[];
}
