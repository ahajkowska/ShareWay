import {
  Controller,
  Get,
  Post,
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
import { CreateExpenseDto } from './dto/index.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { TripAccessGuard } from '../trips/guards/trip-access.guard.js';
import type { RequestWithUser } from '../trips/trips.controller.js';
import type { Expense } from './entities/expense.entity.js';

@Controller()
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  private formatExpenseResponse(expense: Expense) {
    return {
      id: expense.id,
      tripId: expense.tripId,
      title: expense.title,
      description: expense.description || '',
      amount: expense.amount / 100,
      paidBy: expense.payerId,
      paidByName: expense.payer?.nickname || 'Unknown',
      splitBetween:
        expense.debtors
          ?.map((d) => d.debtor?.nickname)
          .filter(Boolean) || [],
      date: expense.date.toISOString(),
      createdAt: expense.createdAt.toISOString(),
    };
  }

  @Post('trips/:id/expenses')
  @UseGuards(TripAccessGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Req() req: RequestWithUser,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    const userId = req.user!.userId;
    const expense = await this.financeService.create(
      tripId,
      userId,
      createExpenseDto,
    );
    return this.formatExpenseResponse(expense);
  }

  @Get('trips/:id/expenses')
  @UseGuards(TripAccessGuard)
  async findAll(@Param('id', ParseUUIDPipe) tripId: string) {
    const expenses = await this.financeService.findAllByTrip(tripId);
    return expenses.map((expense) => this.formatExpenseResponse(expense));
  }

  @Get('trips/:id/balance')
  @UseGuards(TripAccessGuard)
  async getBalance(@Param('id', ParseUUIDPipe) tripId: string) {
    return this.financeService.calculateBalance(tripId);
  }

  @Get('trips/:id/balance-summary')
  @UseGuards(TripAccessGuard)
  async getBalanceSummary(
    @Param('id', ParseUUIDPipe) tripId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.financeService.calculateBalanceSummary(
      tripId,
      req.user!.userId,
    );
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
