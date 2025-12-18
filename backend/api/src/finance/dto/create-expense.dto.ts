import {
  IsArray,
  IsDateString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  IsIn,
} from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsUUID()
  paidBy?: string;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string; // Optional - will use trip's baseCurrency if not provided

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  date: Date;

  @IsArray()
  @IsUUID('4', { each: true })
  debtorIds: string[];

  @IsOptional()
  @IsIn(['PENDING', 'SETTLED'])
  status?: 'PENDING' | 'SETTLED';
}
