import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Trip, Participant, ParticipantRole } from './entities/index.js';
import { CreateTripDto, UpdateTripDto, JoinTripDto } from './dto/index.js';

const INVITE_CODE_LENGTH = 6;
const INVITE_CODE_EXPIRY_DAYS = 7;
const INVITE_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);

  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: string, createTripDto: CreateTripDto): Promise<Trip> {
    const { startDate, endDate, ...rest } = createTripDto;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      throw new BadRequestException('End date must be after start date');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const trip = queryRunner.manager.create(Trip, {
        ...rest,
        startDate: start,
        endDate: end,
        baseCurrency: createTripDto.baseCurrency || 'USD',
      });

      const savedTrip = await queryRunner.manager.save(trip);

      const participant = queryRunner.manager.create(Participant, {
        userId,
        tripId: savedTrip.id,
        role: ParticipantRole.ORGANIZER,
      });

      await queryRunner.manager.save(participant);
      await queryRunner.commitTransaction();

      this.logger.log(`Trip created: ${savedTrip.id} by user ${userId}`);

      return this.findById(savedTrip.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByUser(userId: string): Promise<Trip[]> {
    const participants = await this.participantRepository.find({
      where: { userId },
      relations: ['trip', 'trip.participants', 'trip.participants.user'],
    });

    return participants
      .map((p) => p.trip)
      .filter((trip) => !trip.isDeleted)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  async findById(tripId: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId, isDeleted: false },
      relations: ['participants', 'participants.user'],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  async update(tripId: string, updateTripDto: UpdateTripDto): Promise<Trip> {
    const trip = await this.findById(tripId);

    const { startDate, endDate, ...rest } = updateTripDto;

    const newStartDate = startDate ? new Date(startDate) : trip.startDate;
    const newEndDate = endDate ? new Date(endDate) : trip.endDate;

    if (newEndDate < newStartDate) {
      throw new BadRequestException('End date must be after start date');
    }

    Object.assign(trip, {
      ...rest,
      startDate: newStartDate,
      endDate: newEndDate,
    });

    await this.tripRepository.save(trip);

    this.logger.log(`Trip updated: ${tripId}`);

    return this.findById(tripId);
  }

  async softDelete(tripId: string): Promise<{ message: string }> {
    const trip = await this.findById(tripId);

    trip.isDeleted = true;
    await this.tripRepository.save(trip);

    this.logger.log(`Trip soft deleted: ${tripId}`);

    return { message: 'Trip deleted successfully' };
  }

  async generateInviteCode(
    tripId: string,
  ): Promise<{ inviteCode: string; expiresAt: Date }> {
    const trip = await this.findById(tripId);

    let inviteCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      inviteCode = this.generateRandomCode();
      const existing = await this.tripRepository.findOne({
        where: { inviteCode },
      });
      if (!existing) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new BadRequestException(
        'Failed to generate unique invite code, please try again',
      );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITE_CODE_EXPIRY_DAYS);

    trip.inviteCode = inviteCode;
    trip.inviteCodeExpiry = expiresAt;

    await this.tripRepository.save(trip);

    this.logger.log(`Invite code generated for trip ${tripId}: ${inviteCode}`);

    return { inviteCode, expiresAt };
  }

  async joinByCode(userId: string, joinTripDto: JoinTripDto): Promise<Trip> {
    const { inviteCode } = joinTripDto;

    const trip = await this.tripRepository.findOne({
      where: { inviteCode: inviteCode.toUpperCase(), isDeleted: false },
    });

    if (!trip) {
      throw new NotFoundException('Invalid invite code');
    }

    if (trip.inviteCodeExpiry && new Date() > trip.inviteCodeExpiry) {
      throw new BadRequestException('Invite code has expired');
    }

    const existingParticipant = await this.participantRepository.findOne({
      where: { userId, tripId: trip.id },
    });

    if (existingParticipant) {
      throw new BadRequestException(
        'You are already a participant of this trip',
      );
    }

    const participant = this.participantRepository.create({
      userId,
      tripId: trip.id,
      role: ParticipantRole.PARTICIPANT,
    });

    await this.participantRepository.save(participant);

    this.logger.log(`User ${userId} joined trip ${trip.id} via invite code`);

    return this.findById(trip.id);
  }

  async getParticipants(tripId: string): Promise<Participant[]> {
    return this.participantRepository.find({
      where: { tripId },
      relations: ['user'],
      order: { joinedAt: 'ASC' },
    });
  }

  async removeParticipant(
    tripId: string,
    userId: string,
    requesterId: string,
  ): Promise<{ message: string }> {
    const requester = await this.participantRepository.findOne({
      where: { tripId, userId: requesterId },
    });

    if (!requester) {
      throw new ForbiddenException('You are not a participant of this trip');
    }

    if (userId === requesterId) {
      const organizers = await this.participantRepository.count({
        where: { tripId, role: ParticipantRole.ORGANIZER },
      });

      if (organizers <= 1 && requester.role === ParticipantRole.ORGANIZER) {
        throw new BadRequestException(
          'Cannot leave trip as the only organizer',
        );
      }
    } else {
      if (requester.role !== ParticipantRole.ORGANIZER) {
        throw new ForbiddenException('Only organizers can remove participants');
      }
    }

    const participant = await this.participantRepository.findOne({
      where: { tripId, userId },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    await this.participantRepository.remove(participant);

    this.logger.log(`User ${userId} removed from trip ${tripId}`);

    return { message: 'Participant removed successfully' };
  }

  private generateRandomCode(): string {
    let code = '';
    for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
      code += INVITE_CODE_CHARS.charAt(
        Math.floor(Math.random() * INVITE_CODE_CHARS.length),
      );
    }
    return code;
  }
}
