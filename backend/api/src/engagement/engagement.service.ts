import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

        // Verify option belongs to vote (simple check)
        const option = await this.voteOptionRepository.findOne({ where: { id: optionId }, relations: ['vote'] });
        if (!option) {
            throw new NotFoundException('Option not found');
        }
        if (option.voteId !== voteId) {
            throw new BadRequestException('Option does not belong to the specified vote');
        }

        // Check if user has already voted for this vote
        // We need to look up all options for this vote, then check casts for this user.
        // Or doing a count query.
        const existingCast = await this.voteCastRepository.findOne({
            where: {
                voterId: userId,
                option: { voteId }
            },
            relations: ['option'] // needed for where clause
        });

        if (existingCast) {
            // Option: Update vote or throw? "Cast" implies making a mark. Maybe update?
            // Let's assume re-vote is allowed -> Delete old, add new. Or just Update.
            // Let's remove old first.
            await this.voteCastRepository.remove(existingCast);
        }

        const cast = this.voteCastRepository.create({
            optionId,
            voterId: userId,
        });

        return this.voteCastRepository.save(cast);
    }

    async removeVoteCast(voteId: string, userId: string): Promise<void> {
        const existingCast = await this.voteCastRepository.findOne({
            where: {
                voterId: userId,
                option: { voteId }
            },
            relations: ['option']
        });

        if (existingCast) {
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

    async deleteChecklistItem(itemId: string): Promise<void> {
        // Just delete. Guard protects trip access.
        // Ideally verify trip again?
        await this.checklistItemRepository.delete(itemId);
    }
}
