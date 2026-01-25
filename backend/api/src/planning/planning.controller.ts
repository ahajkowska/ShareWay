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
import { PlanningService } from './planning.service.js';
import {
  CreateDayDto,
  CreateActivityDto,
  UpdateActivityDto,
} from './dto/index.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { TripAccessGuard } from '../trips/guards/trip-access.guard.js';
import type { Request as ExpressRequest } from 'express';
import type { AuthenticatedUser } from '../auth/interfaces/auth.interfaces.js';

interface RequestWithUser extends ExpressRequest {
  user?: AuthenticatedUser;
}

@Controller()
@UseGuards(JwtAuthGuard)
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Get('trips/:id/plan')
  @UseGuards(TripAccessGuard)
  async getPlan(@Param('id', ParseUUIDPipe) tripId: string) {
    const days = await this.planningService.getPlan(tripId);

    return days.map((day) => this.formatDayResponse(day));
  }

  @Post('trips/:id/days')
  @UseGuards(TripAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  async createDay(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Body() createDayDto: CreateDayDto,
  ) {
    const day = await this.planningService.createDay(tripId, createDayDto);

    return this.formatDayResponse(day);
  }

  @Delete('days/:dayId')
  @HttpCode(HttpStatus.OK)
  async deleteDay(
    @Param('dayId', ParseUUIDPipe) dayId: string,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      return null;
    }

    return this.planningService.deleteDay(dayId, userId);
  }

  @Post('days/:dayId/activities')
  @HttpCode(HttpStatus.CREATED)
  async createActivity(
    @Param('dayId', ParseUUIDPipe) dayId: string,
    @Body() createActivityDto: CreateActivityDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      return null;
    }

    const activity = await this.planningService.createActivity(
      dayId,
      userId,
      createActivityDto,
    );

    return this.formatActivityResponse(activity);
  }

  @Patch('activities/:id')
  @HttpCode(HttpStatus.OK)
  async updateActivity(
    @Param('id', ParseUUIDPipe) activityId: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      return null;
    }

    const activity = await this.planningService.updateActivity(
      activityId,
      userId,
      updateActivityDto,
    );

    return this.formatActivityResponse(activity);
  }

  @Delete('activities/:id')
  @HttpCode(HttpStatus.OK)
  async deleteActivity(
    @Param('id', ParseUUIDPipe) activityId: string,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      return null;
    }

    return this.planningService.deleteActivity(activityId, userId);
  }

  private formatDayResponse(day: {
    id: string;
    date: Date;
    tripId: string;
    createdAt: Date;
    updatedAt: Date;
    activities?: Array<{
      id: string;
      type: string;
      title: string;
      description: string | null;
      startTime: string | null;
      endTime: string | null;
      location: string | null;
      creatorId: string;
      createdAt: Date;
      updatedAt: Date;
      creator?: { id: string; email: string; nickname: string };
    }>;
  }) {
    return {
      id: day.id,
      date: day.date,
      tripId: day.tripId,
      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
      activities:
        day.activities?.map((a) => this.formatActivityResponse(a)) ?? [],
    };
  }

  private formatActivityResponse(activity: {
    id: string;
    type: string;
    title: string;
    description: string | null;
    startTime: string | null;
    endTime: string | null;
    location: string | null;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
    creator?: { id: string; email: string; nickname: string };
  }) {
    return {
      id: activity.id,
      dayId: (activity as any).dayId,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      startTime: activity.startTime ? activity.startTime : null,
      endTime: activity.endTime ? activity.endTime : null,
      location: activity.location,
      createdBy: activity.creatorId,
      createdByName: activity.creator?.nickname || 'Unknown',
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    };
  }
}
