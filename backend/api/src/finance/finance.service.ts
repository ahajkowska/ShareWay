import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense, ExpenseDebtor } from './entities/index.js';
import { CreateExpenseDto } from './dto/index.js';
import { TripsService } from '../trips/trips.service.js';
import { ParticipantRole } from '../trips/entities/participant.entity.js';

@Injectable()
export class FinanceService {
    constructor(
        @InjectRepository(Expense)
        private readonly expenseRepository: Repository<Expense>,
        @InjectRepository(ExpenseDebtor)
        private readonly expenseDebtorRepository: Repository<ExpenseDebtor>,
        private readonly tripsService: TripsService,
    ) { }

    async create(tripId: string, payerId: string, createExpenseDto: CreateExpenseDto): Promise<Expense> {
        const { debtorIds, ...expenseData } = createExpenseDto;

        // Verify trip exists and user is participant (Guards usually handle access, but good to ensure trip exists)
        // Here we rely on the controller guards to check trip access.

        // Create expense
        const expense = this.expenseRepository.create({
            ...expenseData,
            tripId,
            payerId,
        });

        const savedExpense = await this.expenseRepository.save(expense);

        // Create debtors
        if (debtorIds.length > 0) {
            const debtors = debtorIds.map((debtorId) =>
                this.expenseDebtorRepository.create({
                    expenseId: savedExpense.id,
                    debtorId,
                }),
            );
            await this.expenseDebtorRepository.save(debtors);
        }

        // Return complete expense
        return this.findOne(savedExpense.id);
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

        // Only payer or trip organizer can delete? 
        // For now, let's say only payer can delete their own expense.
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
            const numberOfSplitters = expense.debtors.length; // Assuming full split including debtors only? 
            // Logic check: usually the payer is also part of the split if they are in debtors list.
            // If the implementation expects `debtorIds` to only contain OTHER people, then we need to know if payer is included.
            // Simple logic for V1: Payer paid X. Debtors owe X / count.
            // Wait, if I pay for dinner for Me and You, I put You in debtors.
            // If I put Myself in debtors, then I owe myself.
            // Let's assume the FE sends ALL participants who share the cost, including the payer if they shared.

            const splitAmount = Math.floor(totalAmount / numberOfSplitters);
            // Remainder handling could be added but let's keep it simple for V1.

            // Payer paid the full amount, so they are "owed" the full amount initially (conceptually)
            // OR simpler:
            // Payer gets +totalAmount (they paid it)
            // Everyone in debtors gets -splitAmount (they consumed it)

            addToBalance(payerId, totalAmount);

            for (const debtor of expense.debtors) {
                addToBalance(debtor.debtorId, -splitAmount);
            }
        }

        // Now convert balances to "Who owes Whom"
        // This is a simplified "settle up" algorithm.
        const creditors: { userId: string; amount: number }[] = [];
        const debtors: { userId: string; amount: number }[] = [];

        for (const [userId, amount] of Object.entries(balances)) {
            if (amount > 0) creditors.push({ userId, amount });
            if (amount < 0) debtors.push({ userId, amount: -amount });
        }

        // Sort by amount descending to minimize transactions
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
