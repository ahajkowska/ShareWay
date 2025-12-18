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
import { FinanceService } from './finance.service.js';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/index.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { TripAccessGuard } from '../trips/guards/trip-access.guard.js';
import type { RequestWithUser } from '../trips/trips.controller.js';

@Controller()
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('trips/:id/expenses')
  @UseGuards(TripAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Req() req: RequestWithUser,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    const userId = req.user!.userId;
    return this.financeService.create(tripId, userId, createExpenseDto);
  }

  @Get('trips/:id/expenses')
  @UseGuards(TripAccessGuard)
  async findAll(@Param('id', ParseUUIDPipe) tripId: string) {
    return this.financeService.findAllByTrip(tripId);
  }

  @Get('trips/:id/balance')
  @UseGuards(TripAccessGuard)
  async getBalance(@Param('id', ParseUUIDPipe) tripId: string) {
    return this.financeService.calculateBalance(tripId);
  }

  @Get('trips/:id/my-balance')
  @UseGuards(TripAccessGuard)
  async getMyBalance(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user!.userId;
    return this.financeService.calculateMyBalance(tripId, userId);
  }

  @Patch('expenses/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user!.userId;
    return this.financeService.update(id, userId, updateExpenseDto);
  }

  @Delete('expenses/:id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user!.userId;
    return this.financeService.remove(id, userId);
  }
}
