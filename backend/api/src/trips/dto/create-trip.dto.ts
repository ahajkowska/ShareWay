import {
  IsString,
  IsOptional,
  IsDateString,
  MaxLength,
  MinLength,
  IsIn,
  IsNotEmpty,
} from 'class-validator';
import { SUPPORTED_CURRENCIES } from '../constants/currencies.js';

export class CreateTripDto {
  @IsString()
  @MinLength(1, { message: 'Trip name is required' })
  @MaxLength(255, { message: 'Trip name must be at most 255 characters' })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Description must be at most 2000 characters' })
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Location must be at most 255 characters' })
  location?: string;

  @IsDateString({}, { message: 'Start date must be a valid date' })
  startDate: string;

  @IsDateString({}, { message: 'End date must be a valid date' })
  endDate: string;

  @IsString()
  @IsNotEmpty({ message: 'Base currency is required' })
  @IsIn(SUPPORTED_CURRENCIES, {
    message: `Currency must be one of: ${SUPPORTED_CURRENCIES.join(', ')}`,
  })
  baseCurrency: string;
}
