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

@Controller() // Base route handled by methods
@UseGuards(JwtAuthGuard)
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

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

    @Delete('expenses/:id')
    // We need a guard that checks if the expense belongs to a trip the user is in.
    // Ideally, we fetch the expense first, check access, then delete.
    // For now we trust the service to handle permissions or we can add a specific ExpenseAccessGuard.
    // But TripAccessGuard works on /trips/:id/... routes.
    // This route is /expenses/:id.
    // So we explicitly check logic in service using allow-list or fetch-and-verify style.
    async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
        const userId = req.user!.userId;
        return this.financeService.remove(id, userId);
    }
}
