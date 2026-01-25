import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, ArrayMinSize, MaxLength } from 'class-validator';

export class CreateVoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  initialOptions: string[];
}
