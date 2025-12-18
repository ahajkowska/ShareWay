import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TripsService } from './trips.service.js';
import { CreateTripDto, UpdateTripDto, JoinTripDto } from './dto/index.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { TripAccessGuard } from './guards/trip-access.guard.js';
import { OrganizerOnly } from './decorators/organizer-only.decorator.js';
import type { Request as ExpressRequest } from 'express';
import type { AuthenticatedUser } from '../auth/interfaces/auth.interfaces.js';
import { Participant, Trip } from './entities/index.js';

export interface RequestWithUser extends ExpressRequest {
  user?: AuthenticatedUser;
  participant?: Participant;
}

interface TripResponse {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date;
  baseCurrency: string;
  inviteCode: string | null;
  inviteCodeExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
  participants?: Array<{
    id: string;
    userId: string;
    role: string;
    joinedAt: Date;
    user?: {
      id: string;
      email: string;
      nickname: string;
    };
  }>;
}

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: RequestWithUser,
    @Body() createTripDto: CreateTripDto,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      return null;
    }

    const trip = await this.tripsService.create(userId, createTripDto);

    return this.formatTripResponse(trip);
  }

  @Get()
  async findAll(@Req() req: RequestWithUser) {
    const userId = req.user?.userId;
    if (!userId) {
      return [];
    }

    const trips = await this.tripsService.findAllByUser(userId);

    return trips.map((trip) => this.formatTripResponse(trip));
  }

  @Post('join')
  @HttpCode(HttpStatus.OK)
  async join(@Req() req: RequestWithUser, @Body() joinTripDto: JoinTripDto) {
    const userId = req.user?.userId;
    if (!userId) {
      return null;
    }

    const trip = await this.tripsService.joinByCode(userId, joinTripDto);

    return {
      message: 'Successfully joined the trip',
      trip: this.formatTripResponse(trip),
    };
  }

  @Get(':id')
  @UseGuards(TripAccessGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const trip = await this.tripsService.findById(id);

    return this.formatTripResponse(trip);
  }

  @Patch(':id')
  @UseGuards(TripAccessGuard)
  @OrganizerOnly()
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    const trip = await this.tripsService.update(id, updateTripDto);

    return this.formatTripResponse(trip);
  }

  @Delete(':id')
  @UseGuards(TripAccessGuard)
  @OrganizerOnly()
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripsService.softDelete(id);
  }

  @Post(':id/invite-code')
  @UseGuards(TripAccessGuard)
  @OrganizerOnly()
  @HttpCode(HttpStatus.OK)
  async generateInviteCode(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripsService.generateInviteCode(id);
  }

  @Get(':id/participants')
  @UseGuards(TripAccessGuard)
  async getParticipants(@Param('id', ParseUUIDPipe) id: string) {
    const participants = await this.tripsService.getParticipants(id);

    return participants.map((p) => ({
      id: p.id,
      userId: p.userId,
      role: p.role,
      joinedAt: p.joinedAt,
      user: {
        id: p.user.id,
        email: p.user.email,
        nickname: p.user.nickname,
      },
    }));
  }

  @Delete(':id/participants/:userId')
  @UseGuards(TripAccessGuard)
  @HttpCode(HttpStatus.OK)
  async removeParticipant(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Req() req: RequestWithUser,
  ) {
    const requesterId = req.user?.userId;
    if (!requesterId) {
      return null;
    }

    return this.tripsService.removeParticipant(tripId, userId, requesterId);
  }

  private formatTripResponse(trip: Trip): TripResponse {
    return {
      id: trip.id,
      name: trip.name,
      description: trip.description,
      location: trip.location,
      startDate: trip.startDate,
      endDate: trip.endDate,
      baseCurrency: trip.baseCurrency,
      inviteCode: trip.inviteCode,
      inviteCodeExpiry: trip.inviteCodeExpiry,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
      participants: trip.participants?.map((p: Participant) => ({
        id: p.id,
        userId: p.userId,
        role: p.role,
        joinedAt: p.joinedAt,
        user: p.user
          ? {
            id: p.user.id,
            email: p.user.email,
            nickname: p.user.nickname,
          }
          : undefined,
      })),
    };
  }
}
