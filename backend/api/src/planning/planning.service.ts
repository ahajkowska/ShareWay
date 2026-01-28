import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Day, Activity } from './entities/index.js';
import { Trip } from '../trips/entities/trip.entity.js';
import {
  Participant,
  ParticipantRole,
} from '../trips/entities/participant.entity.js';
import { CreateDayDto } from './dto/create-day.dto.js';
import { CreateActivityDto } from './dto/create-activity.dto.js';
import { UpdateActivityDto } from './dto/update-activity.dto.js';

@Injectable()
export class PlanningService {
  private readonly logger = new Logger(PlanningService.name);

  constructor(
    @InjectRepository(Day)
    private readonly dayRepository: Repository<Day>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) { }

  async getPlan(tripId: string): Promise<Day[]> {
    return this.dayRepository.find({
      where: { tripId },
      relations: ['activities', 'activities.creator'],
      order: { date: 'ASC', activities: { startTime: 'ASC' } },
    });
  }

  async createDay(tripId: string, createDayDto: CreateDayDto): Promise<Day> {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId, isDeleted: false },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const dayDate = new Date(createDayDto.date);
    const tripStart = new Date(trip.startDate);
    const tripEnd = new Date(trip.endDate);

    if (dayDate < tripStart || dayDate > tripEnd) {
      throw new BadRequestException(
        `Day date must be between trip start (${tripStart.toISOString().split('T')[0]}) and end (${tripEnd.toISOString().split('T')[0]})`,
      );
    }

    const existingDay = await this.dayRepository.findOne({
      where: { tripId, date: dayDate },
    });

    if (existingDay) {
      throw new BadRequestException(
        'A day with this date already exists for this trip',
      );
    }

    const day = this.dayRepository.create({
      tripId,
      date: dayDate,
    });

    const savedDay = await this.dayRepository.save(day);

    this.logger.log(`Day created for trip ${tripId}: ${createDayDto.date}`);

    return this.findDayById(savedDay.id);
  }

  async findDayById(dayId: string): Promise<Day> {
    const day = await this.dayRepository.findOne({
      where: { id: dayId },
      relations: ['activities', 'activities.creator', 'trip'],
    });

    if (!day) {
      throw new NotFoundException('Day not found');
    }

    return day;
  }

  async deleteDay(dayId: string, userId: string): Promise<{ message: string }> {
    const day = await this.findDayById(dayId);

    const participant = await this.participantRepository.findOne({
      where: { tripId: day.tripId, userId },
    });

    if (!participant || participant.role !== ParticipantRole.ORGANIZER) {
      throw new ForbiddenException('Only organizers can delete days');
    }

    await this.dayRepository.remove(day);

    this.logger.log(`Day ${dayId} deleted`);

    return { message: 'Day deleted successfully' };
  }

  async createActivity(
    dayId: string,
    userId: string,
    createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    await this.findDayById(dayId);

    const startTime = this.extractTime(createActivityDto.startTime);
    const endTime = this.extractTime(createActivityDto.endTime);

    if (startTime && endTime) {
      if (startTime > endTime) {
        throw new BadRequestException('Start time must be before end time');
      }
    }

    const activity = this.activityRepository.create({
      ...createActivityDto,
      startTime,
      endTime,
      dayId,
      creatorId: userId,
    });

    const savedActivity = await this.activityRepository.save(activity);

    this.logger.log(`Activity created: ${savedActivity.id} by user ${userId}`);

    return this.findActivityById(savedActivity.id);
  }

  async findActivityById(activityId: string): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
      relations: ['creator', 'day', 'day.trip'],
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return activity;
  }

  async updateActivity(
    activityId: string,
    userId: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    const activity = await this.findActivityById(activityId);

    const participant = await this.participantRepository.findOne({
      where: { tripId: activity.day.tripId, userId },
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant of this trip');
    }

    if (
      activity.creatorId !== userId &&
      participant.role !== ParticipantRole.ORGANIZER
    ) {
      throw new ForbiddenException(
        'Only the creator or organizers can update this activity',
      );
    }

    const startTime = this.extractTime(updateActivityDto.startTime) ?? activity.startTime;
    const endTime = this.extractTime(updateActivityDto.endTime) ?? activity.endTime;

    if (startTime && endTime) {
      if (startTime > endTime) {
        throw new BadRequestException('Start time must be before end time');
      }
    }

    Object.assign(activity, {
      ...updateActivityDto,
      startTime,
      endTime,
    });

    await this.activityRepository.save(activity);

    this.logger.log(`Activity ${activityId} updated by user ${userId}`);

    return this.findActivityById(activityId);
  }

  async deleteActivity(
    activityId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const activity = await this.findActivityById(activityId);

    const participant = await this.participantRepository.findOne({
      where: { tripId: activity.day.tripId, userId },
    });

    if (!participant) {
      throw new ForbiddenException('You are not a participant of this trip');
    }

    if (
      activity.creatorId !== userId &&
      participant.role !== ParticipantRole.ORGANIZER
    ) {
      throw new ForbiddenException(
        'Only the creator or organizers can delete this activity',
      );
    }

    await this.activityRepository.remove(activity);

    this.logger.log(`Activity ${activityId} deleted by user ${userId}`);

    return { message: 'Activity deleted successfully' };
  }

  async getTripIdFromDay(dayId: string): Promise<string> {
    const day = await this.dayRepository.findOne({
      where: { id: dayId },
    });

    if (!day) {
      throw new NotFoundException('Day not found');
    }

    return day.tripId;
  }

  async getTripIdFromActivity(activityId: string): Promise<string> {
    const activity = await this.activityRepository.findOne({
      where: { id: activityId },
      relations: ['day'],
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return activity.day.tripId;
  }

  // Item #74: Extract HH:MM from ISO string if needed
  private extractTime(value: string | undefined): string | undefined {
    if (!value) return undefined;
    if (/^\d{2}:\d{2}$/.test(value)) return value;
    if (value.includes('T')) {
      return value.split('T')[1].substring(0, 5);
    }
    return value;
  }
}
