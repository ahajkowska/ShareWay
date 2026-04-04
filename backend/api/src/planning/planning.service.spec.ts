import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlanningService } from './planning.service';
import { Day } from './entities/day.entity';
import { Activity } from './entities/activity.entity';
import { Trip } from '../trips/entities/trip.entity';
import {
  Participant,
  ParticipantRole,
} from '../trips/entities/participant.entity';

const makeDay = (overrides: Partial<Day> = {}): Day =>
  ({
    id: 'day-1',
    tripId: 'trip-1',
    date: new Date('2024-06-05'),
    activities: [],
    trip: { id: 'trip-1' } as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as unknown as Day;

const makeActivity = (overrides: Partial<Activity> = {}): Activity =>
  ({
    id: 'act-1',
    dayId: 'day-1',
    creatorId: 'user-1',
    type: 'OTHER',
    title: 'Sightseeing',
    description: null,
    startTime: '09:00',
    endTime: '12:00',
    location: 'Eiffel Tower',
    day: { tripId: 'trip-1' } as any,
    creator: { id: 'user-1', nickname: 'Alice' } as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as unknown as Activity;

const makeTrip = (overrides = {}): Trip =>
  ({
    id: 'trip-1',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-10'),
    isDeleted: false,
    ...overrides,
  }) as unknown as Trip;

const mockDayRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockActivityRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockTripRepo = {
  findOne: jest.fn(),
};

const mockParticipantRepo = {
  findOne: jest.fn(),
};

describe('PlanningService', () => {
  let service: PlanningService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanningService,
        { provide: getRepositoryToken(Day), useValue: mockDayRepo },
        { provide: getRepositoryToken(Activity), useValue: mockActivityRepo },
        { provide: getRepositoryToken(Trip), useValue: mockTripRepo },
        {
          provide: getRepositoryToken(Participant),
          useValue: mockParticipantRepo,
        },
      ],
    }).compile();

    service = module.get<PlanningService>(PlanningService);
  });

  describe('getPlan', () => {
    it('returns days with activities', async () => {
      const days = [makeDay()];
      mockDayRepo.find.mockResolvedValue(days);
      const result = await service.getPlan('trip-1');
      expect(result).toBe(days);
    });
  });

  describe('createDay', () => {
    it('throws NotFoundException when trip not found', async () => {
      mockTripRepo.findOne.mockResolvedValue(null);
      await expect(
        service.createDay('trip-1', { date: '2024-06-05' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when date is before trip start', async () => {
      mockTripRepo.findOne.mockResolvedValue(makeTrip());
      await expect(
        service.createDay('trip-1', { date: '2024-05-20' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when date is after trip end', async () => {
      mockTripRepo.findOne.mockResolvedValue(makeTrip());
      await expect(
        service.createDay('trip-1', { date: '2024-06-15' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when day already exists', async () => {
      mockTripRepo.findOne.mockResolvedValue(makeTrip());
      mockDayRepo.findOne.mockResolvedValue(makeDay());
      await expect(
        service.createDay('trip-1', { date: '2024-06-05' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates day successfully', async () => {
      mockTripRepo.findOne.mockResolvedValue(makeTrip());
      const day = makeDay();
      mockDayRepo.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(day);
      mockDayRepo.create.mockReturnValue(day);
      mockDayRepo.save.mockResolvedValue(day);

      const result = await service.createDay('trip-1', { date: '2024-06-05' });
      expect(result).toBe(day);
    });
  });

  describe('findDayById', () => {
    it('returns day when found', async () => {
      const day = makeDay();
      mockDayRepo.findOne.mockResolvedValue(day);
      const result = await service.findDayById('day-1');
      expect(result).toBe(day);
    });

    it('throws NotFoundException when not found', async () => {
      mockDayRepo.findOne.mockResolvedValue(null);
      await expect(service.findDayById('nope')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteDay', () => {
    it('throws ForbiddenException when user is not organizer', async () => {
      mockDayRepo.findOne.mockResolvedValue(makeDay());
      mockParticipantRepo.findOne.mockResolvedValue({
        role: ParticipantRole.PARTICIPANT,
      });
      await expect(service.deleteDay('day-1', 'user-2')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws ForbiddenException when user is not a participant', async () => {
      mockDayRepo.findOne.mockResolvedValue(makeDay());
      mockParticipantRepo.findOne.mockResolvedValue(null);
      await expect(service.deleteDay('day-1', 'stranger')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deletes day when user is organizer', async () => {
      const day = makeDay();
      mockDayRepo.findOne.mockResolvedValue(day);
      mockParticipantRepo.findOne.mockResolvedValue({
        role: ParticipantRole.ORGANIZER,
      });
      mockDayRepo.remove.mockResolvedValue({});

      const result = await service.deleteDay('day-1', 'user-1');
      expect(mockDayRepo.remove).toHaveBeenCalledWith(day);
      expect(result).toEqual({ message: 'Day deleted successfully' });
    });
  });

  describe('createActivity', () => {
    it('throws NotFoundException when day not found', async () => {
      mockDayRepo.findOne.mockResolvedValue(null);
      await expect(
        service.createActivity('day-1', 'user-1', {
          type: 'OTHER',
          title: 'Walk',
        } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when start time is after end time', async () => {
      mockDayRepo.findOne.mockResolvedValue(makeDay());
      await expect(
        service.createActivity('day-1', 'user-1', {
          type: 'OTHER',
          title: 'Walk',
          startTime: '14:00',
          endTime: '10:00',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates activity successfully', async () => {
      const day = makeDay();
      const activity = makeActivity();
      mockDayRepo.findOne.mockResolvedValue(day);
      mockActivityRepo.create.mockReturnValue(activity);
      mockActivityRepo.save.mockResolvedValue(activity);
      mockActivityRepo.findOne.mockResolvedValue(activity);

      const result = await service.createActivity('day-1', 'user-1', {
        type: 'OTHER',
        title: 'Walk',
      } as any);
      expect(result).toBe(activity);
    });
  });

  describe('findActivityById', () => {
    it('returns activity when found', async () => {
      const activity = makeActivity();
      mockActivityRepo.findOne.mockResolvedValue(activity);
      const result = await service.findActivityById('act-1');
      expect(result).toBe(activity);
    });

    it('throws NotFoundException when not found', async () => {
      mockActivityRepo.findOne.mockResolvedValue(null);
      await expect(service.findActivityById('nope')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateActivity', () => {
    it('throws ForbiddenException when user is not a participant', async () => {
      mockActivityRepo.findOne.mockResolvedValue(makeActivity());
      mockParticipantRepo.findOne.mockResolvedValue(null);
      await expect(
        service.updateActivity('act-1', 'stranger', {}),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws ForbiddenException when non-creator non-organizer tries to update', async () => {
      mockActivityRepo.findOne.mockResolvedValue(
        makeActivity({ creatorId: 'user-1' }),
      );
      mockParticipantRepo.findOne.mockResolvedValue({
        role: ParticipantRole.PARTICIPANT,
      });
      await expect(
        service.updateActivity('act-1', 'user-99', {}),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws BadRequestException when time order is wrong', async () => {
      mockActivityRepo.findOne.mockResolvedValue(
        makeActivity({ creatorId: 'user-1' }),
      );
      mockParticipantRepo.findOne.mockResolvedValue({
        role: ParticipantRole.PARTICIPANT,
      });
      await expect(
        service.updateActivity('act-1', 'user-1', {
          startTime: '15:00',
          endTime: '10:00',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('updates activity when creator makes the request', async () => {
      const activity = makeActivity({ creatorId: 'user-1' });
      mockActivityRepo.findOne.mockResolvedValue(activity);
      mockParticipantRepo.findOne.mockResolvedValue({
        role: ParticipantRole.PARTICIPANT,
      });
      mockActivityRepo.save.mockResolvedValue(activity);
      const updated = makeActivity({ title: 'Updated Walk' });
      mockActivityRepo.findOne
        .mockResolvedValueOnce(activity)
        .mockResolvedValueOnce(updated);

      const result = await service.updateActivity('act-1', 'user-1', {
        title: 'Updated Walk',
      });
      expect(result.title).toBe('Updated Walk');
    });

    it('allows organizer to update any activity', async () => {
      const activity = makeActivity({ creatorId: 'user-1' });
      mockActivityRepo.findOne.mockResolvedValue(activity);
      mockParticipantRepo.findOne.mockResolvedValue({
        role: ParticipantRole.ORGANIZER,
      });
      mockActivityRepo.save.mockResolvedValue(activity);
      const updated = makeActivity({ title: 'Org Updated' });
      mockActivityRepo.findOne
        .mockResolvedValueOnce(activity)
        .mockResolvedValueOnce(updated);

      const result = await service.updateActivity('act-1', 'org-1', {
        title: 'Org Updated',
      });
      expect(result.title).toBe('Org Updated');
    });
  });

  describe('deleteActivity', () => {
    it('throws ForbiddenException when user is not a participant', async () => {
      mockActivityRepo.findOne.mockResolvedValue(makeActivity());
      mockParticipantRepo.findOne.mockResolvedValue(null);
      await expect(service.deleteActivity('act-1', 'stranger')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws ForbiddenException when non-creator non-organizer tries to delete', async () => {
      mockActivityRepo.findOne.mockResolvedValue(
        makeActivity({ creatorId: 'user-1' }),
      );
      mockParticipantRepo.findOne.mockResolvedValue({
        role: ParticipantRole.PARTICIPANT,
      });
      await expect(service.deleteActivity('act-1', 'user-99')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deletes activity when creator makes the request', async () => {
      const activity = makeActivity({ creatorId: 'user-1' });
      mockActivityRepo.findOne.mockResolvedValue(activity);
      mockParticipantRepo.findOne.mockResolvedValue({
        role: ParticipantRole.PARTICIPANT,
      });
      mockActivityRepo.remove.mockResolvedValue({});

      const result = await service.deleteActivity('act-1', 'user-1');
      expect(mockActivityRepo.remove).toHaveBeenCalledWith(activity);
      expect(result).toEqual({ message: 'Activity deleted successfully' });
    });
  });

  describe('getTripIdFromDay', () => {
    it('returns tripId when day exists', async () => {
      mockDayRepo.findOne.mockResolvedValue({ tripId: 'trip-1' });
      expect(await service.getTripIdFromDay('day-1')).toBe('trip-1');
    });

    it('throws NotFoundException when day not found', async () => {
      mockDayRepo.findOne.mockResolvedValue(null);
      await expect(service.getTripIdFromDay('nope')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getTripIdFromActivity', () => {
    it('returns tripId when activity exists', async () => {
      mockActivityRepo.findOne.mockResolvedValue({
        day: { tripId: 'trip-1' },
      });
      expect(await service.getTripIdFromActivity('act-1')).toBe('trip-1');
    });

    it('throws NotFoundException when activity not found', async () => {
      mockActivityRepo.findOne.mockResolvedValue(null);
      await expect(service.getTripIdFromActivity('nope')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
