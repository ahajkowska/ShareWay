import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Vote, VoteOption, VoteCast, ChecklistItem, ChecklistItemState } from './entities/index.js';
import { CreateVoteDto, CastVoteDto, CreateChecklistItemDto, UpdateChecklistStatusDto } from './dto/index.js';
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
    ) { }

    // --- Voting ---

    async createVote(tripId: string, createVoteDto: CreateVoteDto): Promise<Vote> {
        const { question, options } = createVoteDto;

        const vote = this.voteRepository.create({
            tripId,
            question,
        });

        // Create options
        vote.options = options.map((text) =>
            this.voteOptionRepository.create({ text }),
        );

        return this.voteRepository.save(vote);
    }

    async getVotes(tripId: string): Promise<Vote[]> {
        return this.voteRepository.find({
            where: { tripId },
            relations: ['options', 'options.casts', 'options.casts.voter'],
            order: { createdAt: 'DESC' },
        });
    }

    async castVote(voteId: string, userId: string, castVoteDto: CastVoteDto): Promise<VoteCast> {
        const { optionId } = castVoteDto;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Verify option belongs to vote
            const option = await this.voteOptionRepository.findOne({ where: { id: optionId }, relations: ['vote'] });
            if (!option) {
                throw new NotFoundException('Option not found');
            }
            if (option.voteId !== voteId) {
                throw new BadRequestException('Option does not belong to the specified vote');
            }

            // Security Check: Verify user is in trip
            const isParticipant = await this.tripsService.isParticipant(option.vote.tripId, userId);
            if (!isParticipant) {
                throw new ForbiddenException('You must be a participant of the trip to vote');
            }

            // Check if user has already voted for this vote
            // Lock the search to prevent race conditions where user double-votes concurrently
            // (Note: pessimistic_write might lock more than intended depending on db, but here we scan for specific user/vote)
            const existingCast = await queryRunner.manager.findOne(VoteCast, {
                where: {
                    voterId: userId,
                    option: { voteId }
                },
                relations: ['option'],
                lock: { mode: 'pessimistic_write' }
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
            // Clean up error if it's unrelated to transaction logic?
            // Just rethrow. check for locking timeouts if extremely high load.
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async removeVoteCast(voteId: string, userId: string): Promise<void> {
        const existingCast = await this.voteCastRepository.findOne({
            where: {
                voterId: userId,
                option: { voteId }
            },
            relations: ['option', 'option.vote']
        });

        if (existingCast) {
            const isParticipant = await this.tripsService.isParticipant(existingCast.option.vote.tripId, userId);
            if (!isParticipant) {
                throw new ForbiddenException('You must be a participant of the trip to manage votes');
            }
            await this.voteCastRepository.remove(existingCast);
        }
    }

    // --- Checklist ---

    async createChecklistItem(tripId: string, dto: CreateChecklistItemDto): Promise<ChecklistItem> {
        const item = this.checklistItemRepository.create({
            tripId,
            text: dto.text,
        });
        return this.checklistItemRepository.save(item);
    }

    async getChecklist(tripId: string, userId: string) {
        // We want all items, and for each item, the state for THIS user.
        // Could be done with query builder left join.
        const items = await this.checklistItemRepository.createQueryBuilder('item')
            .leftJoinAndSelect('item.states', 'state', 'state.userId = :userId', { userId })
            .where('item.tripId = :tripId', { tripId })
            .orderBy('item.createdAt', 'ASC')
            .getMany();

        // Format response if needed, or return entities.
        // Entities will have `states` array with 0 or 1 element.
        return items.map(item => ({
            id: item.id,
            text: item.text,
            tripId: item.tripId,
            isChecked: item.states && item.states.length > 0 ? item.states[0].isChecked : false,
        }));
    }

    async updateChecklistStatus(itemId: string, userId: string, dto: UpdateChecklistStatusDto): Promise<ChecklistItemState> {
        const item = await this.checklistItemRepository.findOne({ where: { id: itemId } });
        if (!item) {
            throw new NotFoundException('Checklist item not found');
        }

        const isParticipant = await this.tripsService.isParticipant(item.tripId, userId);
        if (!isParticipant) {
            throw new ForbiddenException('You must be a participant of the trip');
        }

        let state = await this.checklistItemStateRepository.findOne({
            where: { itemId, userId }
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
        const item = await this.checklistItemRepository.findOne({ where: { id: itemId } });
        if (!item) {
            throw new NotFoundException('Checklist item not found');
        }

        const isParticipant = await this.tripsService.isParticipant(item.tripId, userId);
        if (!isParticipant) {
            throw new ForbiddenException('You must be a participant of the trip');
        }

        await this.checklistItemRepository.delete(itemId);
    }
}
