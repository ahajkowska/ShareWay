import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  IsIn,
} from 'class-validator';

export class UpdateExpenseDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  debtorIds?: string[];

  @IsOptional()
  @IsIn(['PENDING', 'SETTLED'])
  status?: 'PENDING' | 'SETTLED';
}
