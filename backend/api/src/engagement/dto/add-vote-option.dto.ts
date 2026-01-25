import { IsNotEmpty, IsString } from 'class-validator';

export class AddVoteOptionDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
