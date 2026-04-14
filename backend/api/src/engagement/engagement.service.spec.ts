import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EngagementService } from './engagement.service';
import { Vote } from './entities/vote.entity';
import { VoteOption } from './entities/vote-option.entity';
import { VoteCast } from './entities/vote-cast.entity';
import { ChecklistItem } from './entities/checklist-item.entity';
import { ChecklistItemState } from './entities/checklist-item-state.entity';
import { TripsService } from '../trips/trips.service';
import { ParticipantRole } from '../trips/entities/participant.entity';

const makeVote = (overrides: Partial<Vote> = {}): Vote =>
  ({
    id: 'vote-1',
    tripId: 'trip-1',
    question: 'Where to eat?',
    description: null,
    endsAt: null,
    creatorId: 'user-1',
    status: 'active',
    options: [],
    creator: { id: 'user-1', nickname: 'Alice' } as any,
    createdAt: new Date(),
    ...overrides,
  }) as unknown as Vote;

const makeVoteOption = (overrides: Partial<VoteOption> = {}): VoteOption =>
  ({
    id: 'opt-1',
    voteId: 'vote-1',
    text: 'Pizza',
    casts: [],
    vote: makeVote(),
    ...overrides,
  }) as unknown as VoteOption;

const makeVoteCast = (overrides: Partial<VoteCast> = {}): VoteCast =>
  ({
    id: 'cast-1',
    optionId: 'opt-1',
    voterId: 'user-1',
    option: makeVoteOption(),
    ...overrides,
  }) as unknown as VoteCast;

const makeChecklistItem = (overrides: Partial<ChecklistItem> = {}): ChecklistItem =>
  ({
    id: 'item-1',
    tripId: 'trip-1',
    text: 'Pack sunscreen',
    states: [],
    createdAt: new Date(),
    ...overrides,
  }) as unknown as ChecklistItem;

const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  },
};

const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};

const mockVoteRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockVoteOptionRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockVoteCastRepo = {
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockChecklistItemRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockChecklistItemStateRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockTripsService = {
  isParticipant: jest.fn(),
  findById: jest.fn(),
  getParticipant: jest.fn(),
};

describe('EngagementService', () => {
  let service: EngagementService;

  beforeEach(async () => {
    jest.resetAllMocks();
    mockDataSource.createQueryRunner.mockReturnValue(mockQueryRunner);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EngagementService,
        { provide: getRepositoryToken(Vote), useValue: mockVoteRepo },
        { provide: getRepositoryToken(VoteOption), useValue: mockVoteOptionRepo },
        { provide: getRepositoryToken(VoteCast), useValue: mockVoteCastRepo },
        { provide: getRepositoryToken(ChecklistItem), useValue: mockChecklistItemRepo },
        { provide: getRepositoryToken(ChecklistItemState), useValue: mockChecklistItemStateRepo },
        { provide: TripsService, useValue: mockTripsService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<EngagementService>(EngagementService);
  });

  describe('createVote', () => {
    it('creates vote with initial options', async () => {
      const vote = makeVote({ options: [makeVoteOption()] });
      mockVoteRepo.create.mockReturnValue(vote);
      mockVoteOptionRepo.create.mockImplementation((data: any) => ({
        text: data.text,
      }));
      mockVoteRepo.save.mockResolvedValue(vote);

      const result = await service.createVote('trip-1', 'user-1', {
        question: 'Where to eat?',
        options: ['Pizza', 'Sushi'],
        description: null,
        endDate: null,
      } as any);

      expect(mockVoteRepo.create).toHaveBeenCalled();
      expect(mockVoteRepo.save).toHaveBeenCalled();
      expect(result).toBe(vote);
    });
  });

  describe('getVotes', () => {
    it('returns votes for a trip', async () => {
      const votes = [makeVote()];
      mockVoteRepo.find.mockResolvedValue(votes);
      const result = await service.getVotes('trip-1', 'user-1');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('vote-1');
      expect(result[0].title).toBe('Where to eat?');
      expect(result[0].status).toBe('active');
    });
  });

  describe('castVote', () => {
    it('throws NotFoundException when option not found', async () => {
      mockVoteOptionRepo.findOne.mockResolvedValue(null);
      await expect(
        service.castVote('vote-1', 'user-1', { optionIds: ['opt-99'] }),
      ).rejects.toThrow(NotFoundException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('throws BadRequestException when option does not belong to vote', async () => {
      const opt = makeVoteOption({ voteId: 'OTHER-VOTE' });
      mockVoteOptionRepo.findOne.mockResolvedValue(opt);
      await expect(
        service.castVote('vote-1', 'user-1', { optionIds: ['opt-1'] }),
      ).rejects.toThrow(BadRequestException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('throws ForbiddenException when user is not a trip participant', async () => {
      const opt = makeVoteOption({ voteId: 'vote-1' });
      mockVoteOptionRepo.findOne.mockResolvedValue(opt);
      mockTripsService.isParticipant.mockResolvedValue(false);

      await expect(
        service.castVote('vote-1', 'user-99', { optionIds: ['opt-1'] }),
      ).rejects.toThrow(ForbiddenException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('removes existing cast and creates new one', async () => {
      const opt = makeVoteOption({ voteId: 'vote-1' });
      mockVoteOptionRepo.findOne.mockResolvedValue(opt);
      mockTripsService.isParticipant.mockResolvedValue(true);
      const existingCast = makeVoteCast();
      mockQueryRunner.manager.findOne.mockResolvedValue(existingCast);
      mockQueryRunner.manager.remove.mockResolvedValue({});
      const newCast = makeVoteCast({ id: 'cast-2' });
      mockQueryRunner.manager.create.mockReturnValue(newCast);
      mockQueryRunner.manager.save.mockResolvedValue(newCast);

      const result = await service.castVote('vote-1', 'user-1', { optionIds: ['opt-1'] });
      expect(mockQueryRunner.manager.remove).toHaveBeenCalledWith(existingCast);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(result[0]).toBe(newCast);
    });

    it('creates new cast when no existing cast', async () => {
      const opt = makeVoteOption({ voteId: 'vote-1' });
      mockVoteOptionRepo.findOne.mockResolvedValue(opt);
      mockTripsService.isParticipant.mockResolvedValue(true);
      mockQueryRunner.manager.findOne.mockResolvedValue(null);
      const newCast = makeVoteCast();
      mockQueryRunner.manager.create.mockReturnValue(newCast);
      mockQueryRunner.manager.save.mockResolvedValue(newCast);

      const result = await service.castVote('vote-1', 'user-1', { optionIds: ['opt-1'] });
      expect(mockQueryRunner.manager.remove).not.toHaveBeenCalled();
      expect(result[0]).toBe(newCast);
    });
  });

  describe('removeVoteCast', () => {
    it('does nothing when no existing cast found', async () => {
      mockVoteCastRepo.findOne.mockResolvedValue(null);
      await service.removeVoteCast('vote-1', 'user-1');
      expect(mockVoteCastRepo.remove).not.toHaveBeenCalled();
    });

    it('throws ForbiddenException when user is not a participant', async () => {
      const cast = makeVoteCast({
        option: makeVoteOption({ vote: makeVote({ tripId: 'trip-1' }) as any }),
      });
      mockVoteCastRepo.findOne.mockResolvedValue(cast);
      mockTripsService.isParticipant.mockResolvedValue(false);
      await expect(service.removeVoteCast('vote-1', 'user-99')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('removes cast when user is participant', async () => {
      const cast = makeVoteCast({
        option: makeVoteOption({ vote: makeVote({ tripId: 'trip-1' }) as any }),
      });
      mockVoteCastRepo.findOne.mockResolvedValue(cast);
      mockTripsService.isParticipant.mockResolvedValue(true);
      mockVoteCastRepo.remove.mockResolvedValue({});
      await service.removeVoteCast('vote-1', 'user-1');
      expect(mockVoteCastRepo.remove).toHaveBeenCalledWith(cast);
    });
  });

  describe('addVoteOption', () => {
    it('throws NotFoundException when vote not found', async () => {
      mockVoteRepo.findOne.mockResolvedValue(null);
      await expect(
        service.addVoteOption('vote-1', 'user-1', { text: 'Sushi' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when user is not a participant', async () => {
      mockVoteRepo.findOne.mockResolvedValue(makeVote());
      mockTripsService.isParticipant.mockResolvedValue(false);
      await expect(
        service.addVoteOption('vote-1', 'stranger', { text: 'Sushi' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('adds option successfully', async () => {
      mockVoteRepo.findOne.mockResolvedValue(makeVote());
      mockTripsService.isParticipant.mockResolvedValue(true);
      const newOpt = makeVoteOption({ text: 'Sushi' });
      mockVoteOptionRepo.create.mockReturnValue(newOpt);
      mockVoteOptionRepo.save.mockResolvedValue(newOpt);

      const result = await service.addVoteOption('vote-1', 'user-1', { text: 'Sushi' });
      expect(result).toBe(newOpt);
    });
  });

  describe('deleteVote', () => {
    it('throws NotFoundException when vote not found', async () => {
      mockVoteRepo.findOne.mockResolvedValue(null);
      await expect(service.deleteVote('vote-1', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when user is neither creator nor organizer', async () => {
      const vote = makeVote({ creatorId: 'user-1' });
      mockVoteRepo.findOne.mockResolvedValue(vote);
      // user-99 is not creator, and getParticipant returns PARTICIPANT role
      mockTripsService.getParticipant.mockResolvedValue({
        userId: 'user-99',
        role: ParticipantRole.PARTICIPANT,
      });
      await expect(service.deleteVote('vote-1', 'user-99')).rejects.toThrow(ForbiddenException);
    });

    it('deletes vote when user is creator', async () => {
      const vote = makeVote({ creatorId: 'user-1' });
      mockVoteRepo.findOne.mockResolvedValue(vote);
      mockTripsService.getParticipant.mockResolvedValue({
        userId: 'user-1',
        role: ParticipantRole.PARTICIPANT,
      });
      mockVoteRepo.remove.mockResolvedValue({});

      await service.deleteVote('vote-1', 'user-1');
      expect(mockVoteRepo.remove).toHaveBeenCalledWith(vote);
    });

    it('deletes vote when user is organizer', async () => {
      const vote = makeVote({ creatorId: 'other-user' });
      mockVoteRepo.findOne.mockResolvedValue(vote);
      mockTripsService.getParticipant.mockResolvedValue({
        userId: 'org-1',
        role: ParticipantRole.ORGANIZER,
      });
      mockVoteRepo.remove.mockResolvedValue({});

      await service.deleteVote('vote-1', 'org-1');
      expect(mockVoteRepo.remove).toHaveBeenCalled();
    });
  });

  describe('createChecklistItem', () => {
    it('creates and saves a checklist item', async () => {
      const item = makeChecklistItem();
      mockChecklistItemRepo.create.mockReturnValue(item);
      mockChecklistItemRepo.save.mockResolvedValue(item);

      const result = await service.createChecklistItem('trip-1', 'user-1', { text: 'Pack sunscreen' });
      expect(result).toBe(item);
    });
  });

  describe('getChecklist', () => {
    it('returns mapped checklist items with isChecked state', async () => {
      const item = makeChecklistItem({
        states: [{ isChecked: true } as any],
      });
      const mockQB = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([item]),
      };
      mockChecklistItemRepo.createQueryBuilder.mockReturnValue(mockQB);

      const result = await service.getChecklist('trip-1', 'user-1');
      expect(result).toHaveLength(1);
      expect(result[0].isChecked).toBe(true);
    });

    it('returns isChecked false when no states', async () => {
      const item = makeChecklistItem({ states: [] });
      const mockQB = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([item]),
      };
      mockChecklistItemRepo.createQueryBuilder.mockReturnValue(mockQB);

      const result = await service.getChecklist('trip-1', 'user-1');
      expect(result[0].isChecked).toBe(false);
    });
  });

  describe('updateChecklistStatus', () => {
    it('throws NotFoundException when item not found', async () => {
      mockChecklistItemRepo.findOne.mockResolvedValue(null);
      await expect(
        service.updateChecklistStatus('item-1', 'user-1', { isChecked: true }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when user is not a participant', async () => {
      mockChecklistItemRepo.findOne.mockResolvedValue(makeChecklistItem());
      mockTripsService.isParticipant.mockResolvedValue(false);
      await expect(
        service.updateChecklistStatus('item-1', 'stranger', { isChecked: true }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('creates new state when none exists', async () => {
      mockChecklistItemRepo.findOne.mockResolvedValue(makeChecklistItem());
      mockTripsService.isParticipant.mockResolvedValue(true);
      mockChecklistItemStateRepo.findOne.mockResolvedValue(null);
      const newState = { itemId: 'item-1', userId: 'user-1', isChecked: true };
      mockChecklistItemStateRepo.create.mockReturnValue(newState);
      mockChecklistItemStateRepo.save.mockResolvedValue(newState);

      const result = await service.updateChecklistStatus('item-1', 'user-1', { isChecked: true });
      expect(mockChecklistItemStateRepo.create).toHaveBeenCalled();
      expect(result.isChecked).toBe(true);
    });

    it('updates existing state', async () => {
      mockChecklistItemRepo.findOne.mockResolvedValue(makeChecklistItem());
      mockTripsService.isParticipant.mockResolvedValue(true);
      const existingState = { itemId: 'item-1', userId: 'user-1', isChecked: false };
      mockChecklistItemStateRepo.findOne.mockResolvedValue(existingState);
      mockChecklistItemStateRepo.save.mockResolvedValue({ ...existingState, isChecked: true });

      const result = await service.updateChecklistStatus('item-1', 'user-1', { isChecked: true });
      expect(mockChecklistItemStateRepo.create).not.toHaveBeenCalled();
      expect(result.isChecked).toBe(true);
    });
  });

  describe('deleteChecklistItem', () => {
    it('throws NotFoundException when item not found', async () => {
      mockChecklistItemRepo.findOne.mockResolvedValue(null);
      await expect(service.deleteChecklistItem('item-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws ForbiddenException when user is not a participant', async () => {
      mockChecklistItemRepo.findOne.mockResolvedValue(makeChecklistItem());
      mockTripsService.isParticipant.mockResolvedValue(false);
      await expect(service.deleteChecklistItem('item-1', 'stranger')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deletes item when user is the creator', async () => {
      mockChecklistItemRepo.findOne.mockResolvedValue(
        makeChecklistItem({ creatorId: 'user-1' }),
      );
      mockTripsService.isParticipant.mockResolvedValue(true);
      mockTripsService.getParticipant.mockResolvedValue({
        userId: 'user-1',
        role: ParticipantRole.PARTICIPANT,
      });
      mockChecklistItemRepo.delete.mockResolvedValue({});
      await service.deleteChecklistItem('item-1', 'user-1');
      expect(mockChecklistItemRepo.delete).toHaveBeenCalledWith('item-1');
    });

    it('deletes item when user is organizer', async () => {
      mockChecklistItemRepo.findOne.mockResolvedValue(
        makeChecklistItem({ creatorId: 'other-user' }),
      );
      mockTripsService.isParticipant.mockResolvedValue(true);
      mockTripsService.getParticipant.mockResolvedValue({
        userId: 'org-1',
        role: ParticipantRole.ORGANIZER,
      });
      mockChecklistItemRepo.delete.mockResolvedValue({});
      await service.deleteChecklistItem('item-1', 'org-1');
      expect(mockChecklistItemRepo.delete).toHaveBeenCalledWith('item-1');
    });
  });
});
