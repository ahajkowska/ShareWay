import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TripsService } from './trips.service';
import { Trip } from './entities/trip.entity';
import { Participant, ParticipantRole } from './entities/participant.entity';

const makeTrip = (overrides: Partial<Trip> = {}): Trip =>
  ({
    id: 'trip-1',
    name: 'Test Trip',
    description: 'desc',
    location: 'Paris',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-10'),
    baseCurrency: 'USD',
    accentPreset: 'neutral',
    status: 'ACTIVE',
    inviteCode: null,
    inviteCodeExpiry: null,
    isDeleted: false,
    participants: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as unknown as Trip;

const makeParticipant = (overrides: Partial<Participant> = {}): Participant =>
  ({
    id: 'part-1',
    userId: 'user-1',
    tripId: 'trip-1',
    role: ParticipantRole.ORGANIZER,
    joinedAt: new Date(),
    user: { id: 'user-1', nickname: 'Alice' } as any,
    trip: {} as any,
    ...overrides,
  }) as unknown as Participant;

const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    create: jest.fn(),
    save: jest.fn(),
  },
};

const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};

const mockTripRepo = {
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
};

const mockParticipantRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
  remove: jest.fn(),
};

describe('TripsService', () => {
  let service: TripsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
        { provide: getRepositoryToken(Trip), useValue: mockTripRepo },
        {
          provide: getRepositoryToken(Participant),
          useValue: mockParticipantRepo,
        },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<TripsService>(TripsService);
  });

  describe('create', () => {
    it('throws BadRequestException when end date is before start date', async () => {
      await expect(
        service.create('user-1', {
          name: 'Trip',
          startDate: '2024-06-10',
          endDate: '2024-06-01',
          baseCurrency: 'USD',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates trip and organizer participant in a transaction', async () => {
      const savedTrip = makeTrip();
      mockQueryRunner.manager.create
        .mockReturnValueOnce(savedTrip)
        .mockReturnValueOnce(makeParticipant());
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(savedTrip)
        .mockResolvedValueOnce(makeParticipant());

      mockTripRepo.findOne.mockResolvedValue(savedTrip);

      const result = await service.create('user-1', {
        name: 'Trip',
        startDate: '2024-06-01',
        endDate: '2024-06-10',
        baseCurrency: 'USD',
      } as any);

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(result).toBe(savedTrip);
    });

    it('rolls back transaction on error', async () => {
      mockQueryRunner.manager.create.mockReturnValueOnce(makeTrip());
      mockQueryRunner.manager.save.mockRejectedValueOnce(new Error('DB fail'));

      await expect(
        service.create('user-1', {
          name: 'Trip',
          startDate: '2024-06-01',
          endDate: '2024-06-10',
          baseCurrency: 'USD',
        } as any),
      ).rejects.toThrow('DB fail');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('returns non-deleted trips sorted by createdAt desc', async () => {
      const trip1 = makeTrip({
        id: 'trip-1',
        isDeleted: false,
        createdAt: new Date('2024-01-01'),
      });
      const trip2 = makeTrip({
        id: 'trip-2',
        isDeleted: true,
        createdAt: new Date('2024-02-01'),
      });
      const trip3 = makeTrip({
        id: 'trip-3',
        isDeleted: false,
        createdAt: new Date('2024-03-01'),
      });

      mockParticipantRepo.find.mockResolvedValue([
        { trip: trip1 },
        { trip: trip2 },
        { trip: trip3 },
      ]);

      const result = await service.findAllByUser('user-1');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('trip-3');
      expect(result[1].id).toBe('trip-1');
    });
  });

  describe('findById', () => {
    it('returns trip when found', async () => {
      const trip = makeTrip();
      mockTripRepo.findOne.mockResolvedValue(trip);
      const result = await service.findById('trip-1');
      expect(result).toBe(trip);
    });

    it('throws NotFoundException when not found', async () => {
      mockTripRepo.findOne.mockResolvedValue(null);
      await expect(service.findById('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('throws BadRequestException when end date < start date after update', async () => {
      const trip = makeTrip();
      mockTripRepo.findOne.mockResolvedValue(trip);

      await expect(
        service.update('trip-1', {
          startDate: '2024-06-10',
          endDate: '2024-06-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('merges fields and returns updated trip', async () => {
      const trip = makeTrip();
      mockTripRepo.findOne.mockResolvedValue(trip);
      mockTripRepo.save.mockResolvedValue(trip);

      const updated = makeTrip({ name: 'Updated' });

      mockTripRepo.findOne
        .mockResolvedValueOnce(trip)
        .mockResolvedValueOnce(updated);

      const result = await service.update('trip-1', { name: 'Updated' });
      expect(mockTripRepo.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated');
    });

    it('updates location when destination is provided', async () => {
      const trip = makeTrip({ location: 'Old City' });
      mockTripRepo.findOne
        .mockResolvedValueOnce(trip)
        .mockResolvedValueOnce({ ...trip, location: 'New City' });
      mockTripRepo.save.mockResolvedValue(trip);

      const result = await service.update('trip-1', {
        destination: 'New City',
      });
      expect(result.location).toBe('New City');
    });
  });

  describe('softDelete', () => {
    it('sets isDeleted to true', async () => {
      const trip = makeTrip();
      mockTripRepo.findOne.mockResolvedValue(trip);
      mockTripRepo.save.mockResolvedValue(trip);

      const result = await service.softDelete('trip-1');
      expect(trip.isDeleted).toBe(true);
      expect(result).toEqual({ message: 'Trip deleted successfully' });
    });
  });

  describe('generateInviteCode', () => {
    it('generates and stores an invite code', async () => {
      const trip = makeTrip();
      mockTripRepo.findOne
        .mockResolvedValueOnce(trip)
        .mockResolvedValueOnce(null);
      mockTripRepo.save.mockResolvedValue(trip);

      const result = await service.generateInviteCode('trip-1');
      expect(result.inviteCode).toHaveLength(6);
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it('throws BadRequestException after max collision attempts', async () => {
      const trip = makeTrip();

      mockTripRepo.findOne
        .mockResolvedValueOnce(trip)
        .mockResolvedValue({ id: 'another-trip' });

      await expect(service.generateInviteCode('trip-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('joinByCode', () => {
    it('throws NotFoundException for invalid invite code', async () => {
      mockTripRepo.findOne.mockResolvedValue(null);
      await expect(
        service.joinByCode('user-2', { inviteCode: 'BADCOD' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when invite code is expired', async () => {
      const past = new Date('2020-01-01');
      mockTripRepo.findOne.mockResolvedValue(
        makeTrip({ inviteCode: 'ABC123', inviteCodeExpiry: past }),
      );
      await expect(
        service.joinByCode('user-2', { inviteCode: 'ABC123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when user is already a participant', async () => {
      const future = new Date(Date.now() + 1000000);
      mockTripRepo.findOne.mockResolvedValue(
        makeTrip({ inviteCode: 'ABC123', inviteCodeExpiry: future }),
      );
      mockParticipantRepo.findOne.mockResolvedValue(makeParticipant());

      await expect(
        service.joinByCode('user-1', { inviteCode: 'ABC123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates participant and returns trip on success', async () => {
      const future = new Date(Date.now() + 1000000);
      const trip = makeTrip({ inviteCode: 'ABC123', inviteCodeExpiry: future });
      mockTripRepo.findOne
        .mockResolvedValueOnce(trip)
        .mockResolvedValueOnce(trip);
      mockParticipantRepo.findOne.mockResolvedValue(null);
      mockParticipantRepo.create.mockReturnValue(
        makeParticipant({ role: ParticipantRole.PARTICIPANT }),
      );
      mockParticipantRepo.save.mockResolvedValue({});

      const result = await service.joinByCode('user-2', {
        inviteCode: 'ABC123',
      });
      expect(mockParticipantRepo.save).toHaveBeenCalled();
      expect(result).toBe(trip);
    });
  });

  describe('getParticipants', () => {
    it('returns participants with user relation ordered by joinedAt', async () => {
      const participants = [makeParticipant()];
      mockParticipantRepo.find.mockResolvedValue(participants);
      const result = await service.getParticipants('trip-1');
      expect(result).toBe(participants);
    });
  });

  describe('removeParticipant', () => {
    it('throws ForbiddenException when requester is not a participant', async () => {
      mockParticipantRepo.findOne.mockResolvedValue(null);
      await expect(
        service.removeParticipant('trip-1', 'user-2', 'user-3'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws BadRequestException when only organizer tries to leave', async () => {
      const organizer = makeParticipant({
        userId: 'user-1',
        role: ParticipantRole.ORGANIZER,
      });
      mockParticipantRepo.findOne.mockResolvedValue(organizer);
      mockParticipantRepo.count.mockResolvedValue(1);

      await expect(
        service.removeParticipant('trip-1', 'user-1', 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws ForbiddenException when non-organizer tries to remove another user', async () => {
      const participant = makeParticipant({
        userId: 'user-1',
        role: ParticipantRole.PARTICIPANT,
      });
      mockParticipantRepo.findOne.mockResolvedValue(participant);

      await expect(
        service.removeParticipant('trip-1', 'user-2', 'user-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('removes participant successfully when organizer removes another', async () => {
      const organizer = makeParticipant({
        userId: 'req-1',
        role: ParticipantRole.ORGANIZER,
      });
      const target = makeParticipant({ userId: 'user-2', id: 'part-2' });
      mockParticipantRepo.findOne
        .mockResolvedValueOnce(organizer)
        .mockResolvedValueOnce(target);
      mockParticipantRepo.remove.mockResolvedValue({});

      const result = await service.removeParticipant(
        'trip-1',
        'user-2',
        'req-1',
      );
      expect(mockParticipantRepo.remove).toHaveBeenCalledWith(target);
      expect(result).toEqual({ message: 'Participant removed successfully' });
    });

    it('throws NotFoundException when target participant not found', async () => {
      const organizer = makeParticipant({
        userId: 'req-1',
        role: ParticipantRole.ORGANIZER,
      });
      mockParticipantRepo.findOne
        .mockResolvedValueOnce(organizer)
        .mockResolvedValueOnce(null);

      await expect(
        service.removeParticipant('trip-1', 'nobody', 'req-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('isParticipant', () => {
    it('returns true when count > 0', async () => {
      mockParticipantRepo.count.mockResolvedValue(1);
      expect(await service.isParticipant('trip-1', 'user-1')).toBe(true);
    });

    it('returns false when count is 0', async () => {
      mockParticipantRepo.count.mockResolvedValue(0);
      expect(await service.isParticipant('trip-1', 'stranger')).toBe(false);
    });
  });
});
