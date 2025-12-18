import { IsArray, IsDateString, IsInt, IsNotEmpty, IsPositive, IsString, IsUUID, Length } from 'class-validator';

export class CreateExpenseDto {
    @IsInt()
    @IsPositive()
    amount: number;

    @IsString()
    @Length(3, 3)
    currency: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsDateString()
    date: Date;

    @IsArray()
    @IsUUID('4', { each: true })
    debtorIds: string[];
}
