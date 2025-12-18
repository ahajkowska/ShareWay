import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceService } from './finance.service.js';
import { FinanceController } from './finance.controller.js';
import { Expense, ExpenseDebtor } from './entities/index.js';
import { TripsModule } from '../trips/trips.module.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense, ExpenseDebtor, User]),
    TripsModule, // To use TripsService logic if needed (e.g. checking organizer status)
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
