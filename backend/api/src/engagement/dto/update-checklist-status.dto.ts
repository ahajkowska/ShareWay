import { IsBoolean } from 'class-validator';

export class UpdateChecklistStatusDto {
    @IsBoolean()
    isChecked: boolean;
}
