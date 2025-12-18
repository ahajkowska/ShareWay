import { IsArray, IsUUID, ArrayMinSize } from 'class-validator';

export class CastVoteDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1, { message: 'At least one option must be selected' })
  optionIds: string[];
}
