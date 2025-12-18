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
import {
  CreateTripDto,
  UpdateTripDto,
  JoinTripDto,
  TransferRoleDto,
} from './dto/index.js';
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
  destination: string | null;
  startDate: string;
  endDate: string;
  baseCurrency: string;
  inviteCode: string | null;
  inviteCodeExpiry: string | null;
  status: 'ACTIVE' | 'ARCHIVED';
  roleForCurrentUser: 'ORGANIZER' | 'PARTICIPANT' | null; // FIXED: renamed from myRole to match frontend
  createdAt: string;
  updatedAt: string;
  members: Array<{
    id: string;
    name: string;
    avatarUrl: string | null;
  }>;
}

@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

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

    return this.formatTripResponse(trip, userId);
  }

  @Get()
  async findAll(@Req() req: RequestWithUser) {
    const userId = req.user?.userId;
    if (!userId) {
      return [];
    }

    const trips = await this.tripsService.findAllByUser(userId);

    return trips.map((trip) => this.formatTripResponse(trip, userId));
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
      trip: this.formatTripResponse(trip, userId),
    };
  }

  @Get(':id')
  @UseGuards(TripAccessGuard)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    const trip = await this.tripsService.findById(id);

    return this.formatTripResponse(trip, req.user?.userId);
  }

  @Patch(':id')
  @UseGuards(TripAccessGuard)
  @OrganizerOnly()
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTripDto: UpdateTripDto,
    @Req() req: RequestWithUser,
  ) {
    const trip = await this.tripsService.update(id, updateTripDto);

    return this.formatTripResponse(trip, req.user?.userId);
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

  @Patch(':id/archive')
  @UseGuards(TripAccessGuard)
  @OrganizerOnly()
  @HttpCode(HttpStatus.OK)
  async archiveTrip(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    const trip = await this.tripsService.archiveTrip(id);
    return this.formatTripResponse(trip, req.user?.userId);
  }

  @Patch(':id/unarchive')
  @UseGuards(TripAccessGuard)
  @OrganizerOnly()
  @HttpCode(HttpStatus.OK)
  async unarchiveTrip(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    const trip = await this.tripsService.unarchiveTrip(id);
    return this.formatTripResponse(trip, req.user?.userId);
  }

  @Patch(':id/participants/:userId/role')
  @UseGuards(TripAccessGuard)
  @OrganizerOnly()
  @HttpCode(HttpStatus.OK)
  async transferRole(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Param('userId', ParseUUIDPipe) targetUserId: string,
    @Body() dto: TransferRoleDto,
    @Req() req: RequestWithUser,
  ) {
    const requesterId = req.user?.userId;
    if (!requesterId) {
      return null;
    }
    return this.tripsService.transferRole(
      tripId,
      targetUserId,
      dto.newRole,
      requesterId,
    );
  }

  private formatTripResponse(
    trip: Trip,
    requestingUserId?: string,
  ): TripResponse {
    const myParticipant = requestingUserId
      ? trip.participants?.find((p) => p.userId === requestingUserId)
      : undefined;

    return {
      id: trip.id,
      name: trip.name,
      description: trip.description,
      destination: trip.location,
      startDate: trip.startDate.toISOString(),
      endDate: trip.endDate.toISOString(),
      baseCurrency: trip.baseCurrency,
      inviteCode: trip.inviteCode,
      inviteCodeExpiry: trip.inviteCodeExpiry?.toISOString() ?? null,
      status: trip.status ?? 'ACTIVE',
      roleForCurrentUser: myParticipant?.role
        ? (myParticipant.role.toUpperCase() as 'ORGANIZER' | 'PARTICIPANT')
        : null,
      createdAt: trip.createdAt.toISOString(),
      updatedAt: trip.updatedAt.toISOString(),
      members:
        trip.participants?.map((p: Participant) => ({
          id: p.userId,
          name: p.user?.nickname ?? 'Unknown',
          avatarUrl: null,
        })) ?? [],
    };
  }
}
