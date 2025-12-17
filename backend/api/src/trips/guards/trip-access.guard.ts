import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant, ParticipantRole } from '../entities/index.js';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { AuthenticatedUser } from '../../auth/interfaces/auth.interfaces.js';

export const ORGANIZER_ONLY_KEY = 'organizerOnly';

interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
  params: { id?: string; tripId?: string };
  participant?: Participant;
}

@Injectable()
export class TripAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = request.user?.userId;
    const tripId = request.params.id ?? request.params.tripId;

    if (!userId) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!tripId) {
      return true;
    }

    const participant = await this.participantRepository.findOne({
      where: { userId, tripId },
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant of this trip');
    }

    const organizerOnly = this.reflector.get<boolean>(
      ORGANIZER_ONLY_KEY,
      context.getHandler(),
    );

    if (organizerOnly && participant.role !== ParticipantRole.ORGANIZER) {
      throw new ForbiddenException('Only organizers can perform this action');
    }

    request.participant = participant;

    return true;
  }
}
