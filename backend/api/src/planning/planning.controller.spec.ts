import { Test, TestingModule } from '@nestjs/testing';
import { PlanningController } from './planning.controller';
import { PlanningService } from './planning.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TripAccessGuard } from '../trips/guards/trip-access.guard';

const mockPlanningService = {
  getPlan: jest.fn(),
  createDay: jest.fn(),
  deleteDay: jest.fn(),
  createActivity: jest.fn(),
  updateActivity: jest.fn(),
  deleteActivity: jest.fn(),
};

const makeDay = (overrides: any = {}) => ({
  id: 'day-1',
  date: new Date('2024-06-05'),
  tripId: 'trip-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  activities: [],
  ...overrides,
});

const makeActivity = (overrides: any = {}) => ({
  id: 'act-1',
  dayId: 'day-1',
  type: 'OTHER',
  title: 'Walk',
  description: null,
  startTime: '09:00',
  endTime: '11:00',
  location: null,
  creatorId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  creator: { id: 'user-1', nickname: 'Alice' },
  ...overrides,
});

describe('PlanningController', () => {
  let controller: PlanningController;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanningController],
      providers: [{ provide: PlanningService, useValue: mockPlanningService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TripAccessGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PlanningController>(PlanningController);
  });

  describe('getPlan', () => {
    it('returns formatted days', async () => {
      mockPlanningService.getPlan.mockResolvedValue([makeDay()]);
      const result = await controller.getPlan('trip-1');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('day-1');
    });

    it('returns empty activities array when day has no activities', async () => {
      mockPlanningService.getPlan.mockResolvedValue([
        makeDay({ activities: undefined }),
      ]);
      const result = await controller.getPlan('trip-1');
      expect(result[0].activities).toEqual([]);
    });
  });

  describe('createDay', () => {
    it('returns formatted day', async () => {
      mockPlanningService.createDay.mockResolvedValue(makeDay());
      const result = await controller.createDay('trip-1', {
        date: '2024-06-05',
      });
      expect(result.id).toBe('day-1');
    });
  });

  describe('deleteDay', () => {
    it('returns null when no userId', async () => {
      const req: any = { user: undefined };
      expect(await controller.deleteDay('day-1', req)).toBeNull();
    });

    it('delegates to planningService.deleteDay', async () => {
      mockPlanningService.deleteDay.mockResolvedValue({
        message: 'Day deleted successfully',
      });
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.deleteDay('day-1', req);
      expect(result).toEqual({ message: 'Day deleted successfully' });
    });
  });

  describe('createActivity', () => {
    it('returns null when no userId', async () => {
      const req: any = { user: undefined };
      expect(
        await controller.createActivity('day-1', {} as any, req),
      ).toBeNull();
    });

    it('returns formatted activity', async () => {
      mockPlanningService.createActivity.mockResolvedValue(makeActivity());
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.createActivity(
        'day-1',
        { type: 'OTHER', title: 'Walk' } as any,
        req,
      );
      expect(result?.id).toBe('act-1');
    });
  });

  describe('updateActivity', () => {
    it('returns null when no userId', async () => {
      const req: any = { user: undefined };
      expect(await controller.updateActivity('act-1', {}, req)).toBeNull();
    });

    it('returns updated activity', async () => {
      mockPlanningService.updateActivity.mockResolvedValue(
        makeActivity({ title: 'Updated' }),
      );
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.updateActivity(
        'act-1',
        { title: 'Updated' },
        req,
      );
      expect(result?.title).toBe('Updated');
    });
  });

  describe('deleteActivity', () => {
    it('returns null when no userId', async () => {
      const req: any = { user: undefined };
      expect(await controller.deleteActivity('act-1', req)).toBeNull();
    });

    it('delegates to planningService.deleteActivity', async () => {
      mockPlanningService.deleteActivity.mockResolvedValue({
        message: 'Activity deleted successfully',
      });
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.deleteActivity('act-1', req);
      expect(result).toEqual({ message: 'Activity deleted successfully' });
    });
  });
});
