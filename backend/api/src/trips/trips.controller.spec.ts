import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TripAccessGuard } from './guards/trip-access.guard';
import { ParticipantRole } from './entities/participant.entity';

const mockTripsService = {
  create: jest.fn(),
  findAllByUser: jest.fn(),
  joinByCode: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  generateInviteCode: jest.fn(),
  getParticipants: jest.fn(),
  removeParticipant: jest.fn(),
};

const makeTrip = (overrides: any = {}) => ({
  id: 'trip-1',
  name: 'Test Trip',
  description: 'desc',
  location: 'Paris',
  startDate: new Date('2024-06-01'),
  endDate: new Date('2024-06-10'),
  baseCurrency: 'USD',
  accentPreset: 'neutral',
  inviteCode: 'ABC123',
  status: 'ACTIVE',
  isDeleted: false,
  participants: [
    {
      userId: 'user-1',
      role: ParticipantRole.ORGANIZER,
      user: { id: 'user-1', nickname: 'Alice' },
    },
  ],
  ...overrides,
});

describe('TripsController', () => {
  let controller: TripsController;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [{ provide: TripsService, useValue: mockTripsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TripAccessGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TripsController>(TripsController);
  });

  describe('create', () => {
    it('returns null when no userId', async () => {
      const req: any = { user: undefined };
      expect(await controller.create(req, {} as any)).toBeNull();
    });

    it('returns formatted trip response', async () => {
      const trip = makeTrip();
      mockTripsService.create.mockResolvedValue(trip);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.create(req, { name: 'Trip' } as any);
      expect(result).toMatchObject({ id: 'trip-1', name: 'Test Trip' });
    });
  });

  describe('findAll', () => {
    it('returns empty array when no userId', async () => {
      const req: any = { user: undefined };
      expect(await controller.findAll(req)).toEqual([]);
    });

    it('returns mapped trips', async () => {
      mockTripsService.findAllByUser.mockResolvedValue([makeTrip()]);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.findAll(req);
      expect(result).toHaveLength(1);
    });
  });

  describe('join', () => {
    it('returns null when no userId', async () => {
      const req: any = { user: undefined };
      expect(await controller.join(req, { inviteCode: 'X' } as any)).toBeNull();
    });

    it('returns join response', async () => {
      mockTripsService.joinByCode.mockResolvedValue(makeTrip());
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.join(req, {
        inviteCode: 'ABC123',
      } as any);
      expect(result).toMatchObject({ message: 'Successfully joined the trip' });
    });
  });

  describe('findOne', () => {
    it('returns null when no userId', async () => {
      const req: any = { user: undefined };
      expect(await controller.findOne('trip-1', req)).toBeNull();
    });

    it('returns formatted trip', async () => {
      mockTripsService.findById.mockResolvedValue(makeTrip());
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.findOne('trip-1', req);
      expect(result).toMatchObject({ id: 'trip-1' });
    });
  });

  describe('update', () => {
    it('returns null when no userId', async () => {
      const req: any = { user: undefined };
      expect(await controller.update('trip-1', {}, req)).toBeNull();
    });

    it('delegates update and returns formatted trip', async () => {
      mockTripsService.update.mockResolvedValue(makeTrip({ name: 'Updated' }));
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.update(
        'trip-1',
        { name: 'Updated' },
        req,
      );
      expect(result?.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('delegates to softDelete', async () => {
      mockTripsService.softDelete.mockResolvedValue({
        message: 'Trip deleted successfully',
      });
      const result = await controller.remove('trip-1');
      expect(result).toEqual({ message: 'Trip deleted successfully' });
    });
  });

  describe('generateInviteCode', () => {
    it('returns invite code result', async () => {
      const expiresAt = new Date();
      mockTripsService.generateInviteCode.mockResolvedValue({
        inviteCode: 'ABC123',
        expiresAt,
      });
      const result = await controller.generateInviteCode('trip-1');
      expect(result).toEqual({ inviteCode: 'ABC123', expiresAt });
    });
  });

  describe('getParticipants', () => {
    it('returns formatted participants', async () => {
      mockTripsService.getParticipants.mockResolvedValue([
        {
          id: 'part-1',
          userId: 'user-1',
          role: ParticipantRole.ORGANIZER,
          joinedAt: new Date(),
          user: { id: 'user-1', email: 'a@b.com', nickname: 'Alice' },
        },
      ]);
      const result = await controller.getParticipants('trip-1');
      expect(result).toHaveLength(1);
      expect(result[0].user.nickname).toBe('Alice');
    });
  });

  describe('removeParticipant', () => {
    it('returns null when no requesterId', async () => {
      const req: any = { user: undefined };
      expect(
        await controller.removeParticipant('trip-1', 'user-2', req),
      ).toBeNull();
    });

    it('delegates to service', async () => {
      mockTripsService.removeParticipant.mockResolvedValue({
        message: 'Participant removed successfully',
      });
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.removeParticipant(
        'trip-1',
        'user-2',
        req,
      );
      expect(result).toEqual({ message: 'Participant removed successfully' });
    });
  });
});
