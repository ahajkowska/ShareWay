import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
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
  ) {}

  async create(
    tripId: string,
    payerId: string,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    const { splitBetween, amount, date, ...rest } = createExpenseDto;

    const amountInCents = Math.round(amount * 100);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const expense = queryRunner.manager.create(Expense, {
        ...rest,
        amount: amountInCents,
        tripId,
        payerId,
        date: date ? new Date(date) : new Date(),
      });

      const savedExpense = await queryRunner.manager.save(expense);

      if (splitBetween.length > 0) {
        const debtors = splitBetween.map((debtorId) =>
          queryRunner.manager.create(ExpenseDebtor, {
            expenseId: savedExpense.id,
            debtorId,
          }),
        );
        await queryRunner.manager.save(debtors);
      }

      await queryRunner.commitTransaction();

      return this.findOne(savedExpense.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Failed to create expense: ${error.message}`,
        error.stack,
      );
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

    const isParticipant = await this.tripsService.isParticipant(
      expense.tripId,
      userId,
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You must be a current participant of the trip to manage expenses',
      );
    }

    if (expense.payerId !== userId) {
      const trip = await this.tripsService.findById(expense.tripId);
      const isOrganizer = trip.participants.some(
        (p) => p.userId === userId && p.role === ParticipantRole.ORGANIZER,
      );

      if (!isOrganizer) {
        throw new ForbiddenException(
          'You can only delete your own expenses or if you are the organizer',
        );
      }
    }

    await this.expenseRepository.remove(expense);
  }

  async calculateBalance(tripId: string) {
    const expenses = await this.findAllByTrip(tripId);

    const balances: Record<string, number> = {};

    const addToBalance = (userId: string, amount: number) => {
      balances[userId] = (balances[userId] || 0) + amount;
    };

    for (const expense of expenses) {
      if (!expense.debtors || expense.debtors.length === 0) continue;

      const totalAmount = expense.amount;
      const payerId = expense.payerId;
      const debtors = expense.debtors;
      const numberOfSplitters = debtors.length;

      addToBalance(payerId, totalAmount);

      const splitAmount = Math.floor(totalAmount / numberOfSplitters);
      const remainder = totalAmount % numberOfSplitters;

      for (let i = 0; i < numberOfSplitters; i++) {
        const debtor = debtors[i];
        let amountToDebit = splitAmount;

        if (i < remainder) {
          amountToDebit += 1;
        }

        addToBalance(debtor.debtorId, -amountToDebit);
      }
    }
    const creditors: { userId: string; amount: number }[] = [];
    const debtors: { userId: string; amount: number }[] = [];

    for (const [userId, amount] of Object.entries(balances)) {
      if (amount > 0) creditors.push({ userId, amount });
      if (amount < 0) debtors.push({ userId, amount: -amount });
    }

    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    const settlements: { from: string; to: string; amount: number }[] = [];

    let i = 0;
    let j = 0;

    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];

      const amount = Math.min(creditor.amount, debtor.amount);

      if (amount > 0) {
        settlements.push({
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

    const trip = await this.tripsService.findById(tripId);
    const userMap = new Map(
      trip.participants.map((p) => [p.userId, p.user.nickname]),
    );

    const settlementsWithNames = settlements.map((s) => ({
      from: userMap.get(s.from) || 'Unknown',
      to: userMap.get(s.to) || 'Unknown',
      amount: s.amount / 100,
    }));

    const totalExpenses =
      expenses.reduce((sum, e) => sum + e.amount, 0) / 100;

    return {
      settlements: settlementsWithNames,
      totalExpenses,
    };
  }

  async calculateBalanceSummary(tripId: string, userId: string) {
    const expenses = await this.findAllByTrip(tripId);
    const trip = await this.tripsService.findById(tripId);

    const balancesByUser = new Map<
      string,
      {
        userId: string;
        userName: string;
        balance: number;
        expenses: Array<any>;
      }
    >();

    for (const expense of expenses) {
      const totalAmount = expense.amount;
      const debtors = expense.debtors;
      const splitCount = debtors.length;
      const myShare = debtors.some((d) => d.debtorId === userId)
        ? Math.floor(totalAmount / splitCount)
        : 0;
      const iPaid = expense.payerId === userId ? totalAmount : 0;

      if (expense.payerId !== userId && myShare > 0) {
        const payerId = expense.payerId;
        if (!balancesByUser.has(payerId)) {
          balancesByUser.set(payerId, {
            userId: payerId,
            userName: expense.payer.nickname,
            balance: 0,
            expenses: [],
          });
        }
        const entry = balancesByUser.get(payerId)!;
        entry.balance -= myShare;
        entry.expenses.push({
          expenseId: expense.id,
          expenseTitle: expense.title,
          totalAmount: totalAmount / 100,
          myShare: myShare / 100,
          iPaid: 0,
          balance: -(myShare / 100),
        });
      } else if (expense.payerId === userId) {
        for (const debtor of debtors) {
          if (debtor.debtorId === userId) continue;

          if (!balancesByUser.has(debtor.debtorId)) {
            balancesByUser.set(debtor.debtorId, {
              userId: debtor.debtorId,
              userName: debtor.debtor.nickname,
              balance: 0,
              expenses: [],
            });
          }
          const entry = balancesByUser.get(debtor.debtorId)!;
          const theirShare = Math.floor(totalAmount / splitCount);
          entry.balance += theirShare;
          entry.expenses.push({
            expenseId: expense.id,
            expenseTitle: expense.title,
            totalAmount: totalAmount / 100,
            myShare: myShare / 100,
            iPaid: totalAmount / 100,
            balance: theirShare / 100,
          });
        }
      }
    }

    const balances = Array.from(balancesByUser.values()).map((b) => ({
      ...b,
      balance: b.balance / 100,
    }));

    const me = trip.participants.find((p) => p.userId === userId);

    return {
      myUserId: userId,
      myUserName: me?.user.nickname || 'Me',
      balances,
      totalIOweThem: balances.reduce(
        (sum, b) => sum + (b.balance < 0 ? -b.balance : 0),
        0,
      ),
      totalTheyOweMe: balances.reduce(
        (sum, b) => sum + (b.balance > 0 ? b.balance : 0),
        0,
      ),
    };
  }
}
