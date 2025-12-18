import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Vote,
  VoteOption,
  VoteCast,
  ChecklistItem,
  ChecklistItemState,
} from './entities/index.js';
import {
  CreateVoteDto,
  CastVoteDto,
  CreateChecklistItemDto,
  UpdateChecklistStatusDto,
  UpdateVoteDto,
} from './dto/index.js';
import { TripsService } from '../trips/trips.service.js';

@Injectable()
export class EngagementService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(VoteOption)
    private readonly voteOptionRepository: Repository<VoteOption>,
    @InjectRepository(VoteCast)
    private readonly voteCastRepository: Repository<VoteCast>,
    @InjectRepository(ChecklistItem)
    private readonly checklistItemRepository: Repository<ChecklistItem>,
    @InjectRepository(ChecklistItemState)
    private readonly checklistItemStateRepository: Repository<ChecklistItemState>,
    private readonly tripsService: TripsService,
    private readonly dataSource: DataSource,
  ) {}

  // --- Voting ---

  async createVote(
    tripId: string,
    userId: string,
    createVoteDto: CreateVoteDto,
  ): Promise<Vote> {
    const { question, options, description, endDate } = createVoteDto;

    const vote = this.voteRepository.create({
      tripId,
      question,
      description: description ?? null,
      creatorId: userId,
      endsAt: endDate ? new Date(endDate) : null,
    });

    // Create options
    vote.options = options.map((text) =>
      this.voteOptionRepository.create({ text }),
    );

    return this.voteRepository.save(vote);
  }

  async getVotes(tripId: string, requestingUserId: string) {
    const votes = await this.voteRepository.find({
      where: { tripId },
      relations: ['options', 'options.casts', 'options.casts.voter', 'creator'],
      order: { createdAt: 'DESC' },
    });

    return votes.map((vote) => {
      // Auto-compute status: if endsAt is in the past, vote is closed
      const computedStatus =
        vote.endsAt && new Date(vote.endsAt) < new Date()
          ? 'CLOSED'
          : vote.status;

      return {
        id: vote.id,
        title: vote.question,
        description: vote.description,
        createdBy: vote.creatorId,
        createdByName: vote.creator?.nickname ?? null,
        createdAt: vote.createdAt.toISOString(),
        endsAt: vote.endsAt?.toISOString() ?? null,
        status: computedStatus,
        options: vote.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          description: opt.description ?? null,
          votes: opt.casts?.length ?? 0,
          voters: opt.casts?.map((c) => c.voter?.nickname ?? c.voterId) ?? [],
        })),
        totalVoters: new Set(
          vote.options.flatMap((o) => o.casts?.map((c) => c.voterId) ?? []),
        ).size,
        userVote:
          vote.options.find((o) =>
            o.casts?.some((c) => c.voterId === requestingUserId),
          )?.id ?? null,
      };
    });
  }

  async castVote(
    voteId: string,
    userId: string,
    castVoteDto: CastVoteDto,
  ): Promise<VoteCast[]> {
    const { optionIds } = castVoteDto;

    // For now, we'll use only the first optionId (single vote)
    // In future, can expand to multi-choice
    const optionId = optionIds[0];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify option belongs to vote
      const option = await this.voteOptionRepository.findOne({
        where: { id: optionId },
        relations: ['vote'],
      });
      if (!option) {
        throw new NotFoundException('Option not found');
      }
      if (option.voteId !== voteId) {
        throw new BadRequestException(
          'Option does not belong to the specified vote',
        );
      }

      // Security Check: Verify user is in trip
      const isParticipant = await this.tripsService.isParticipant(
        option.vote.tripId,
        userId,
      );
      if (!isParticipant) {
        throw new ForbiddenException(
          'You must be a participant of the trip to vote',
        );
      }

      // Check if user has already voted for this vote
      // Lock the search to prevent race conditions where user double-votes concurrently
      // (Note: pessimistic_write might lock more than intended depending on db, but here we scan for specific user/vote)
      const existingCast = await queryRunner.manager.findOne(VoteCast, {
        where: {
          voterId: userId,
          option: { voteId },
        },
        relations: ['option'],
        lock: { mode: 'pessimistic_write' },
      });

      if (existingCast) {
        await queryRunner.manager.remove(existingCast);
      }

      const cast = queryRunner.manager.create(VoteCast, {
        optionId,
        voterId: userId,
      });

      const savedCast = await queryRunner.manager.save(cast);
      await queryRunner.commitTransaction();
      return [savedCast];
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // Clean up error if it's unrelated to transaction logic?
      // Just rethrow. check for locking timeouts if extremely high load.
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateVote(
    voteId: string,
    userId: string,
    dto: UpdateVoteDto,
  ): Promise<Vote> {
    const vote = await this.voteRepository.findOne({
      where: { id: voteId },
      relations: ['options'],
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    // Verify user is participant of the trip and get their role
    const participant = await this.tripsService.getParticipant(
      vote.tripId,
      userId,
    );
    if (!participant) {
      throw new ForbiddenException('You must be a participant of the trip');
    }

    // Creator OR Organizer can update vote (Item #6 fix)
    const isCreator = vote.creatorId === userId;
    const isOrganizer = participant.role === 'organizer';
    if (!isCreator && !isOrganizer) {
      throw new ForbiddenException(
        'Only the vote creator or organizers can update the vote',
      );
    }

    if (dto.question) vote.question = dto.question;
    if (dto.description !== undefined) vote.description = dto.description;
    if (dto.endDate) vote.endsAt = new Date(dto.endDate);

    return this.voteRepository.save(vote);
  }

  async deleteVote(
    voteId: string,
    userId: string,
  ): Promise<{ message: string }> {
    const vote = await this.voteRepository.findOne({
      where: { id: voteId },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    // Verify user is participant of the trip and get their role
    const participant = await this.tripsService.getParticipant(
      vote.tripId,
      userId,
    );
    if (!participant) {
      throw new ForbiddenException('You must be a participant of the trip');
    }

    // Creator OR Organizer can delete vote (Item #6 fix)
    const isCreator = vote.creatorId === userId;
    const isOrganizer = participant.role === 'organizer';
    if (!isCreator && !isOrganizer) {
      throw new ForbiddenException(
        'Only the vote creator or organizers can delete the vote',
      );
    }

    await this.voteRepository.remove(vote);
    return { message: 'Vote deleted successfully' };
  }

  async addVoteOption(
    voteId: string,
    userId: string,
    dto: { text: string; description?: string },
  ): Promise<VoteOption> {
    const vote = await this.voteRepository.findOne({
      where: { id: voteId },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    const isParticipant = await this.tripsService.isParticipant(
      vote.tripId,
      userId,
    );
    if (!isParticipant) {
      throw new ForbiddenException('You must be a participant of the trip');
    }

    const option = this.voteOptionRepository.create({
      voteId,
      text: dto.text,
      description: dto.description ?? null,
    });

    return this.voteOptionRepository.save(option);
  }

  async removeVoteCast(voteId: string, userId: string): Promise<void> {
    const existingCast = await this.voteCastRepository.findOne({
      where: {
        voterId: userId,
        option: { voteId },
      },
      relations: ['option', 'option.vote'],
    });

    if (existingCast) {
      const isParticipant = await this.tripsService.isParticipant(
        existingCast.option.vote.tripId,
        userId,
      );
      if (!isParticipant) {
        throw new ForbiddenException(
          'You must be a participant of the trip to manage votes',
        );
      }
      await this.voteCastRepository.remove(existingCast);
    }
  }

  // --- Checklist ---

  async createChecklistItem(
    tripId: string,
    userId: string,
    dto: CreateChecklistItemDto,
  ): Promise<ChecklistItem> {
    const item = this.checklistItemRepository.create({
      tripId,
      text: dto.text,
      creatorId: userId,
    });
    return this.checklistItemRepository.save(item);
  }

  async getChecklist(tripId: string, userId: string) {
    // We want all items, and for each item, the state for THIS user.
    // Could be done with query builder left join.
    const items = await this.checklistItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.states', 'state', 'state.userId = :userId', {
        userId,
      })
      .where('item.tripId = :tripId', { tripId })
      .orderBy('item.createdAt', 'ASC')
      .getMany();

    // Format response if needed, or return entities.
    // Entities will have `states` array with 0 or 1 element.
    return items.map((item) => ({
      id: item.id,
      text: item.text,
      tripId: item.tripId,
      isChecked:
        item.states && item.states.length > 0
          ? item.states[0].isChecked
          : false,
    }));
  }

  async updateChecklistStatus(
    itemId: string,
    userId: string,
    dto: UpdateChecklistStatusDto,
  ): Promise<ChecklistItemState> {
    const item = await this.checklistItemRepository.findOne({
      where: { id: itemId },
    });
    if (!item) {
      throw new NotFoundException('Checklist item not found');
    }

    const isParticipant = await this.tripsService.isParticipant(
      item.tripId,
      userId,
    );
    if (!isParticipant) {
      throw new ForbiddenException('You must be a participant of the trip');
    }

    let state = await this.checklistItemStateRepository.findOne({
      where: { itemId, userId },
    });

    if (!state) {
      state = this.checklistItemStateRepository.create({
        itemId,
        userId,
      });
    }

    state.isChecked = dto.isChecked;
    return this.checklistItemStateRepository.save(state);
  }

  async deleteChecklistItem(itemId: string, userId: string): Promise<void> {
    const item = await this.checklistItemRepository.findOne({
      where: { id: itemId },
    });
    if (!item) {
      throw new NotFoundException('Checklist item not found');
    }

    const isParticipant = await this.tripsService.isParticipant(
      item.tripId,
      userId,
    );
    if (!isParticipant) {
      throw new ForbiddenException('You must be a participant of the trip');
    }

    await this.checklistItemRepository.delete(itemId);
  }
}
