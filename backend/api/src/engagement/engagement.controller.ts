import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Req,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import { EngagementService } from './engagement.service.js';
import { CreateVoteDto, CastVoteDto, AddVoteOptionDto, CreateChecklistItemDto, UpdateChecklistStatusDto } from './dto/index.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { TripAccessGuard } from '../trips/guards/trip-access.guard.js';
import type { RequestWithUser } from '../trips/trips.controller.js';
import type { Vote } from './entities/vote.entity.js';

@Controller()
@UseGuards(JwtAuthGuard)
export class EngagementController {
    constructor(private readonly engagementService: EngagementService) { }

    private formatVoteResponse(vote: Vote, currentUserId: string) {
      const options = vote.options.map((option) => ({
        id: option.id,
        text: option.text,
        description: null,
        votes: option.casts?.length || 0,
        voters: option.casts?.map((c) => c.voterId) || [],
      }));

      const allVoters = new Set<string>();
      vote.options.forEach((opt) => {
        opt.casts?.forEach((cast) => allVoters.add(cast.voterId));
      });

      let userVote: string | null = null;
      for (const option of vote.options) {
        const userCast = option.casts?.find((c) => c.voterId === currentUserId);
        if (userCast) {
          userVote = option.id;
          break;
        }
      }

      return {
        id: vote.id,
        title: vote.title || vote.question,
        description: vote.description || null,
        createdBy: vote.createdBy,
        createdAt: vote.createdAt,
        endsAt:
          vote.endsAt ||
          new Date(vote.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000),
        status: vote.status,
        options,
        totalVoters: allVoters.size,
        userVote,
      };
    }

    @Post('trips/:id/votes')
    @UseGuards(TripAccessGuard)
    async createVote(
        @Param('id', ParseUUIDPipe) tripId: string,
        @Body() dto: CreateVoteDto,
        @Req() req: RequestWithUser,
    ) {
        const vote = await this.engagementService.createVote(tripId, req.user!.userId, dto);
        return this.formatVoteResponse(vote, req.user!.userId);
    }

    @Get('trips/:id/votes')
    @UseGuards(TripAccessGuard)
    async getVotes(
        @Param('id', ParseUUIDPipe) tripId: string,
        @Req() req: RequestWithUser,
    ) {
        const votes = await this.engagementService.getVotes(tripId);
        return votes.map((vote) => this.formatVoteResponse(vote, req.user!.userId));
    }

    @Post('votes/:voteId/cast')
    async castVote(
        @Param('voteId', ParseUUIDPipe) voteId: string,
        @Body() dto: CastVoteDto,
        @Req() req: RequestWithUser
    ) {
        return this.engagementService.castVote(voteId, req.user!.userId, dto);
    }

    @Delete('votes/:voteId/cast')
    async removeVoteCast(
        @Param('voteId', ParseUUIDPipe) voteId: string,
        @Req() req: RequestWithUser
    ) {
        return this.engagementService.removeVoteCast(voteId, req.user!.userId);
    }

    @Post('votes/:voteId/options')
    async addOption(
        @Param('voteId', ParseUUIDPipe) voteId: string,
        @Body() dto: AddVoteOptionDto,
        @Req() req: RequestWithUser
    ) {
        return this.engagementService.addOption(voteId, dto, req.user!.userId);
    }

    @Delete('votes/:voteId')
    async deleteVote(
        @Param('voteId', ParseUUIDPipe) voteId: string,
        @Req() req: RequestWithUser
    ) {
        return this.engagementService.deleteVote(voteId, req.user!.userId);
    }

    // --- Checklist ---

    @Get('trips/:id/checklist')
    @UseGuards(TripAccessGuard)
    async getChecklist(
        @Param('id', ParseUUIDPipe) tripId: string,
        @Req() req: RequestWithUser
    ) {
        return this.engagementService.getChecklist(tripId, req.user!.userId);
    }

    @Post('trips/:id/checklist')
    @UseGuards(TripAccessGuard)
    async createChecklistItem(
        @Param('id', ParseUUIDPipe) tripId: string,
        @Body() dto: CreateChecklistItemDto
    ) {
        return this.engagementService.createChecklistItem(tripId, dto);
    }

    @Patch('checklist/:itemId/status')
    async updateChecklistStatus(
        @Param('itemId', ParseUUIDPipe) itemId: string,
        @Body() dto: UpdateChecklistStatusDto,
        @Req() req: RequestWithUser
    ) {
        return this.engagementService.updateChecklistStatus(itemId, req.user!.userId, dto);
    }

    @Delete('checklist/:itemId')
    async deleteChecklistItem(
        @Param('itemId', ParseUUIDPipe) itemId: string,
        @Req() req: RequestWithUser
    ) {
        return this.engagementService.deleteChecklistItem(itemId, req.user!.userId);
    }
}
