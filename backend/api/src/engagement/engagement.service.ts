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
  AddVoteOptionDto,
  CreateChecklistItemDto,
  UpdateChecklistStatusDto,
} from './dto/index.js';
import { TripsService } from '../trips/trips.service.js';
import { ParticipantRole } from '../trips/entities/participant.entity.js';

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

  async createVote(
    tripId: string,
    userId: string,
    createVoteDto: CreateVoteDto,
  ): Promise<Vote> {
    const { title, description, endsAt, initialOptions } = createVoteDto;

    const vote = this.voteRepository.create({
      tripId,
      title,
      description,
      question: title,
      endsAt: endsAt ? new Date(endsAt) : null,
      createdBy: userId,
    });

    vote.options = initialOptions.map((text) =>
      this.voteOptionRepository.create({ text }),
    );

    return this.voteRepository.save(vote);
  }

  async getVotes(tripId: string): Promise<Vote[]> {
    return this.voteRepository.find({
      where: { tripId },
      relations: ['options', 'options.casts', 'options.casts.voter', 'creator'],
      order: { createdAt: 'DESC' },
    });
  }

  async castVote(
    voteId: string,
    userId: string,
    castVoteDto: CastVoteDto,
  ): Promise<VoteCast> {
    const { optionId } = castVoteDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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

      const isParticipant = await this.tripsService.isParticipant(
        option.vote.tripId,
        userId,
      );
      if (!isParticipant) {
        throw new ForbiddenException(
          'You must be a participant of the trip to vote',
        );
      }

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
      return savedCast;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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

  async addOption(
    voteId: string,
    dto: AddVoteOptionDto,
    userId: string,
  ): Promise<VoteOption> {
    const vote = await this.voteRepository.findOne({
      where: { id: voteId },
      relations: ['options'],
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    const isParticipant = await this.tripsService.isParticipant(
      vote.tripId,
      userId,
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You must be a participant to add options',
      );
    }

    const option = this.voteOptionRepository.create({
      voteId,
      text: dto.text,
    });

    return this.voteOptionRepository.save(option);
  }

  async deleteVote(voteId: string, userId: string): Promise<void> {
    const vote = await this.voteRepository.findOne({
      where: { id: voteId },
    });

    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    const trip = await this.tripsService.findById(vote.tripId);
    const isOrganizer = trip.participants.some(
      (p) => p.userId === userId && p.role === ParticipantRole.ORGANIZER,
    );

    if (vote.createdBy !== userId && !isOrganizer) {
      throw new ForbiddenException(
        'Only the creator or organizer can delete this vote',
      );
    }

    await this.voteRepository.remove(vote);
  }

  async createChecklistItem(
    tripId: string,
    dto: CreateChecklistItemDto,
  ): Promise<ChecklistItem> {
    const item = this.checklistItemRepository.create({
      tripId,
      text: dto.text,
    });
    return this.checklistItemRepository.save(item);
  }

  async getChecklist(tripId: string, userId: string) {
    const items = await this.checklistItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.states', 'state', 'state.userId = :userId', {
        userId,
      })
      .where('item.tripId = :tripId', { tripId })
      .orderBy('item.createdAt', 'ASC')
      .getMany();

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
