import { IsString, Length, Matches } from 'class-validator';

export class JoinTripDto {
  @IsString()
  @Length(6, 6, { message: 'Invite code must be exactly 6 characters' })
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Invite code must be uppercase alphanumeric characters only',
  })
  inviteCode: string;
}
