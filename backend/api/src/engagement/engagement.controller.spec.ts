import { Test, TestingModule } from '@nestjs/testing';
import { EngagementController } from './engagement.controller';
import { EngagementService } from './engagement.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TripAccessGuard } from '../trips/guards/trip-access.guard';

const mockEngagementService = {
  createVote: jest.fn(),
  getVotes: jest.fn(),
  castVote: jest.fn(),
  removeVoteCast: jest.fn(),
  addVoteOption: jest.fn(),
  deleteVote: jest.fn(),
  getChecklist: jest.fn(),
  createChecklistItem: jest.fn(),
  updateChecklistStatus: jest.fn(),
  deleteChecklistItem: jest.fn(),
  updateVote: jest.fn(),
};

const makeVote = (overrides: any = {}) => ({
  id: 'vote-1',
  title: 'Where to eat?',
  question: 'Where to eat?',
  description: null,
  createdBy: 'user-1',
  createdAt: new Date(),
  endsAt: null,
  status: 'active',
  options: [],
  ...overrides,
});

describe('EngagementController', () => {
  let controller: EngagementController;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EngagementController],
      providers: [
        { provide: EngagementService, useValue: mockEngagementService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TripAccessGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<EngagementController>(EngagementController);
  });

  describe('createVote', () => {
    it('delegates and returns formatted vote', async () => {
      const vote = makeVote();
      mockEngagementService.createVote.mockResolvedValue(vote);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.createVote('trip-1', {} as any, req);
      expect(result).toMatchObject({ id: 'vote-1' });
    });

    it('formats vote with options that have casts', async () => {
      const vote = makeVote({
        options: [
          {
            id: 'opt-1',
            text: 'Pizza',
            casts: [{ voterId: 'user-1' }, { voterId: 'user-2' }],
          },
          {
            id: 'opt-2',
            text: 'Sushi',
            casts: [],
          },
        ],
      });
      mockEngagementService.createVote.mockResolvedValue(vote);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.createVote('trip-1', {} as any, req);
      expect(result).toMatchObject({ id: 'vote-1' });
      expect(result.options).toBeDefined();
    });
  });

  describe('getVotes', () => {
    it('returns mapped votes', async () => {
      mockEngagementService.getVotes.mockResolvedValue([makeVote()]);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.getVotes('trip-1', req);
      expect(result).toHaveLength(1);
    });

    it('returns userVote as null when user has not voted', async () => {
      const vote = makeVote({
        options: [
          { id: 'opt-1', text: 'Pizza', casts: [{ voterId: 'other-user' }] },
        ],
      });
      mockEngagementService.getVotes.mockResolvedValue([vote]);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.getVotes('trip-1', req);
      expect(result).toHaveLength(1);
      expect(result[0].options).toBeDefined();
    });
  });

  describe('castVote', () => {
    it('delegates to service', async () => {
      mockEngagementService.castVote.mockResolvedValue({ id: 'cast-1' });
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.castVote(
        'vote-1',
        { optionId: 'opt-1' } as any,
        req,
      );
      expect(result).toEqual({ id: 'cast-1' });
    });
  });

  describe('removeVoteCast', () => {
    it('delegates to service', async () => {
      mockEngagementService.removeVoteCast.mockResolvedValue(undefined);
      const req: any = { user: { userId: 'user-1' } };
      await controller.removeVoteCast('vote-1', req);
      expect(mockEngagementService.removeVoteCast).toHaveBeenCalledWith(
        'vote-1',
        'user-1',
      );
    });
  });

  describe('addVoteOption', () => {
    it('delegates to service', async () => {
      const option = { id: 'opt-2', text: 'Sushi' };
      mockEngagementService.addVoteOption.mockResolvedValue(option);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.addVoteOption(
        'vote-1',
        { text: 'Sushi' } as any,
        req,
      );
      expect(result).toEqual(option);
    });
  });

  describe('deleteVote', () => {
    it('delegates to service', async () => {
      mockEngagementService.deleteVote.mockResolvedValue(undefined);
      const req: any = { user: { userId: 'user-1' } };
      await controller.deleteVote('vote-1', req);
      expect(mockEngagementService.deleteVote).toHaveBeenCalledWith(
        'vote-1',
        'user-1',
      );
    });
  });

  describe('getChecklist', () => {
    it('returns checklist', async () => {
      mockEngagementService.getChecklist.mockResolvedValue([
        { id: 'item-1', isChecked: false },
      ]);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.getChecklist('trip-1', req);
      expect(result).toHaveLength(1);
    });
  });

  describe('createChecklistItem', () => {
    it('delegates to service', async () => {
      const item = { id: 'item-1', text: 'Pack sunscreen' };
      mockEngagementService.createChecklistItem.mockResolvedValue(item);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.createChecklistItem(
        'trip-1',
        {
          text: 'Pack sunscreen',
        } as any,
        req,
      );
      expect(result).toBe(item);
    });
  });

  describe('updateChecklistStatus', () => {
    it('delegates to service', async () => {
      const state = { isChecked: true };
      mockEngagementService.updateChecklistStatus.mockResolvedValue(state);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.updateChecklistStatus(
        'item-1',
        { isChecked: true } as any,
        req,
      );
      expect(result).toBe(state);
    });
  });

  describe('deleteChecklistItem', () => {
    it('delegates to service', async () => {
      mockEngagementService.deleteChecklistItem.mockResolvedValue(undefined);
      const req: any = { user: { userId: 'user-1' } };
      await controller.deleteChecklistItem('item-1', req);
      expect(mockEngagementService.deleteChecklistItem).toHaveBeenCalledWith(
        'item-1',
        'user-1',
      );
    });
  });
});
