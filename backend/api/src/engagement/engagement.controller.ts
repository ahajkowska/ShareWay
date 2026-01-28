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
import {
  CreateVoteDto,
  CastVoteDto,
  CreateChecklistItemDto,
  UpdateChecklistStatusDto,
  UpdateVoteDto,
} from './dto/index.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { TripAccessGuard } from '../trips/guards/trip-access.guard.js';
import type { RequestWithUser } from '../trips/trips.controller.js';

@Controller()
@UseGuards(JwtAuthGuard)
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  // --- Votes ---

  @Post('trips/:id/votes')
  @UseGuards(TripAccessGuard)
  async createVote(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Body() dto: CreateVoteDto,
    @Req() req: RequestWithUser,
  ) {
    return this.engagementService.createVote(tripId, req.user!.userId, dto);
  }

  @Get('trips/:id/votes')
  @UseGuards(TripAccessGuard)
  async getVotes(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.engagementService.getVotes(tripId, req.user!.userId);
  }

  @Post('votes/:voteId/cast')
  async castVote(
    @Param('voteId', ParseUUIDPipe) voteId: string,
    @Body() dto: CastVoteDto,
    @Req() req: RequestWithUser,
  ) {
    return this.engagementService.castVote(voteId, req.user!.userId, dto);
  }

  @Delete('votes/:voteId/cast')
  async removeVoteCast(
    @Param('voteId', ParseUUIDPipe) voteId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.engagementService.removeVoteCast(voteId, req.user!.userId);
  }

  @Patch('votes/:id')
  async updateVote(
    @Param('id', ParseUUIDPipe) voteId: string,
    @Body() dto: UpdateVoteDto,
    @Req() req: RequestWithUser,
  ) {
    return this.engagementService.updateVote(voteId, req.user!.userId, dto);
  }

  @Delete('votes/:id')
  async deleteVote(
    @Param('id', ParseUUIDPipe) voteId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.engagementService.deleteVote(voteId, req.user!.userId);
  }

  @Post('votes/:voteId/options')
  async addVoteOption(
    @Param('voteId', ParseUUIDPipe) voteId: string,
    @Body() dto: { text: string; description?: string },
    @Req() req: RequestWithUser,
  ) {
    return this.engagementService.addVoteOption(voteId, req.user!.userId, dto);
  }

  // --- Checklist ---

  @Get('trips/:id/checklist')
  @UseGuards(TripAccessGuard)
  async getChecklist(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.engagementService.getChecklist(tripId, req.user!.userId);
  }

  @Post('trips/:id/checklist')
  @UseGuards(TripAccessGuard)
  async createChecklistItem(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Body() dto: CreateChecklistItemDto,
    @Req() req: RequestWithUser,
  ) {
    return this.engagementService.createChecklistItem(
      tripId,
      req.user!.userId,
      dto,
    );
  }

  @Patch('checklist/:itemId/status')
  async updateChecklistStatus(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateChecklistStatusDto,
    @Req() req: RequestWithUser,
  ) {
    return this.engagementService.updateChecklistStatus(
      itemId,
      req.user!.userId,
      dto,
    );
  }

  @Delete('checklist/:itemId')
  async deleteChecklistItem(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.engagementService.deleteChecklistItem(itemId, req.user!.userId);
  }
}
