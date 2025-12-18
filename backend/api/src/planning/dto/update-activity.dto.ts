import { IsString, IsOptional, IsEnum, Matches } from 'class-validator';
import { ActivityType } from '../entities/activity.entity.js';

export class UpdateActivityDto {
  @IsEnum(ActivityType)
  @IsOptional()
  type?: ActivityType;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$|^\d{4}-\d{2}-\d{2}T.*$/, {
    message: 'startTime must be in HH:MM or ISO 8601 format',
  })
  startTime?: string;

  @IsString()
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$|^\d{4}-\d{2}-\d{2}T.*$/, {
    message: 'endTime must be in HH:MM or ISO 8601 format',
  })
  endTime?: string;

  @IsString()
  @IsOptional()
  location?: string;
}
