import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Expense, ExpenseDebtor } from './entities/index.js';
import { CreateExpenseDto } from './dto/index.js';
import { TripsService } from '../trips/trips.service.js';
import { ParticipantRole } from '../trips/entities/participant.entity.js';

@Injectable()
export class FinanceService {
    private readonly logger = new Logger(FinanceService.name);

    constructor(
        @InjectRepository(Expense)
        private readonly expenseRepository: Repository<Expense>,
        @InjectRepository(ExpenseDebtor)
        private readonly expenseDebtorRepository: Repository<ExpenseDebtor>,
        private readonly tripsService: TripsService,
        private readonly dataSource: DataSource,
    ) { }

    async create(tripId: string, payerId: string, createExpenseDto: CreateExpenseDto): Promise<Expense> {
        const { debtorIds, ...expenseData } = createExpenseDto;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Create expense
            const expense = queryRunner.manager.create(Expense, {
                ...expenseData,
                tripId,
                payerId,
            });

            const savedExpense = await queryRunner.manager.save(expense);

            // Create debtors
            if (debtorIds.length > 0) {
                const debtors = debtorIds.map((debtorId) =>
                    queryRunner.manager.create(ExpenseDebtor, {
                        expenseId: savedExpense.id,
                        debtorId,
                    }),
                );
                await queryRunner.manager.save(debtors);
            }

            await queryRunner.commitTransaction();

            // Return complete expense (fetched normal way after commit)
            return this.findOne(savedExpense.id);

        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Failed to create expense: ${error.message}`, error.stack);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAllByTrip(tripId: string): Promise<Expense[]> {
        return this.expenseRepository.find({
            where: { tripId },
            relations: ['payer', 'debtors', 'debtors.debtor'],
            order: { date: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Expense> {
        const expense = await this.expenseRepository.findOne({
            where: { id },
            relations: ['payer', 'debtors', 'debtors.debtor'],
        });

        if (!expense) {
            throw new NotFoundException(`Expense with ID ${id} not found`);
        }

        return expense;
    }

    async remove(id: string, userId: string): Promise<void> {
        const expense = await this.findOne(id);

        const isParticipant = await this.tripsService.isParticipant(expense.tripId, userId);
        if (!isParticipant) {
            throw new ForbiddenException('You must be a current participant of the trip to manage expenses');
        }

        // Only payer or trip organizer can delete
        if (expense.payerId !== userId) {
            // Check if user is organizer of the trip
            const trip = await this.tripsService.findById(expense.tripId);
            const isOrganizer = trip.participants.some(p => p.userId === userId && p.role === ParticipantRole.ORGANIZER);

            if (!isOrganizer) {
                throw new ForbiddenException('You can only delete your own expenses or if you are the organizer');
            }
        }

        await this.expenseRepository.remove(expense);
    }

    async calculateBalance(tripId: string) {
        const expenses = await this.findAllByTrip(tripId);

        const balances: Record<string, number> = {};

        // Helper to add to balance
        const addToBalance = (userId: string, amount: number) => {
            balances[userId] = (balances[userId] || 0) + amount;
        };

        for (const expense of expenses) {
            if (!expense.debtors || expense.debtors.length === 0) continue;

            const totalAmount = expense.amount; // In cents
            const payerId = expense.payerId;
            const debtors = expense.debtors;
            const numberOfSplitters = debtors.length;

            // Logic: Payer paid 'totalAmount'.
            // This 'totalAmount' is consumed by 'numberOfSplitters'.
            // Each splitter "consumes" a portion.

            // 1. Credit the payer the full amount they paid.
            addToBalance(payerId, totalAmount);

            // 2. Debit each splitter their share.
            const splitAmount = Math.floor(totalAmount / numberOfSplitters);
            const remainder = totalAmount % numberOfSplitters;

            // Distribute base amount
            for (let i = 0; i < numberOfSplitters; i++) {
                const debtor = debtors[i];
                let amountToDebit = splitAmount;

                // Distribute remainder cents to the first few debtors
                if (i < remainder) {
                    amountToDebit += 1;
                }

                addToBalance(debtor.debtorId, -amountToDebit);
            }
        }

        // Now convert balances to "Who owes Whom"
        // Balances > 0 : User is owed money (Creditor)
        // Balances < 0 : User owes money (Debtor)

        const creditors: { userId: string; amount: number }[] = [];
        const debtors: { userId: string; amount: number }[] = [];

        for (const [userId, amount] of Object.entries(balances)) {
            if (amount > 0) creditors.push({ userId, amount });
            if (amount < 0) debtors.push({ userId, amount: -amount }); // Store positive magnitude
        }

        // Sort by amount descending to minimize transaction count
        creditors.sort((a, b) => b.amount - a.amount);
        debtors.sort((a, b) => b.amount - a.amount);

        const transactions: { from: string; to: string; amount: number }[] = [];

        let i = 0; // creditor index
        let j = 0; // debtor index

        while (i < creditors.length && j < debtors.length) {
            const creditor = creditors[i];
            const debtor = debtors[j];

            const amount = Math.min(creditor.amount, debtor.amount);

            if (amount > 0) {
                transactions.push({
                    from: debtor.userId,
                    to: creditor.userId,
                    amount,
                });
            }

            creditor.amount -= amount;
            debtor.amount -= amount;

            if (creditor.amount === 0) i++;
            if (debtor.amount === 0) j++;
        }

        return transactions;
    }
}
