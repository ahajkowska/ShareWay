import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  ArrayMinSize,
} from 'class-validator';

export class CreateVoteDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  options: string[];
}
