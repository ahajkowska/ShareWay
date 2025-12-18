import { IsArray, IsNotEmpty, IsString, ArrayMinSize } from 'class-validator';

export class CreateVoteDto {
    @IsString()
    @IsNotEmpty()
    question: string;

    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(2)
    options: string[];
}
