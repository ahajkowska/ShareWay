import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateDayDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
