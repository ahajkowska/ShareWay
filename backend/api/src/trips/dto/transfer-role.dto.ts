import { IsUUID, IsIn } from 'class-validator';
import { ParticipantRole } from '../entities/participant.entity.js';

export class TransferRoleDto {
  @IsUUID('4')
  targetUserId: string;

  @IsIn([ParticipantRole.ORGANIZER, ParticipantRole.PARTICIPANT])
  newRole: ParticipantRole;
}
