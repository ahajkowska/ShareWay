import { IsString, Length } from 'class-validator';

export class JoinTripDto {
  @IsString()
  @Length(6, 6, { message: 'Invite code must be exactly 6 characters' })
  inviteCode: string;
}
