import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateVoteDto {
  @IsString()
  @IsOptional()
  question?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
