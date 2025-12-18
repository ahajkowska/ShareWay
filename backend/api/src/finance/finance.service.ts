import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Expense, ExpenseDebtor } from './entities/index.js';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/index.js';
import { TripsService } from '../trips/trips.service.js';
import { ParticipantRole } from '../trips/entities/participant.entity.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class FinanceService {
  private readonly logger = new Logger(FinanceService.name);

  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(ExpenseDebtor)
    private readonly expenseDebtorRepository: Repository<ExpenseDebtor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tripsService: TripsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    tripId: string,
    payerId: string,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    const { debtorIds, currency, ...expenseData } = createExpenseDto;

    // Item #4: Auto-use trip's baseCurrency if currency not provided
    let expenseCurrency = currency;
    if (!expenseCurrency) {
      const trip = await this.tripsService.findById(tripId);
      expenseCurrency = trip.baseCurrency;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create expense with resolved currency
      const expense = queryRunner.manager.create(Expense, {
        ...expenseData,
        tripId,
        payerId,
        currency: expenseCurrency,
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
      this.logger.error(
        `Failed to create expense: ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByTrip(tripId: string) {
    const expenses = await this.expenseRepository.find({
      where: { tripId },
      relations: ['payer', 'debtors', 'debtors.debtor'],
      order: { date: 'DESC' },
    });

    return expenses.map((expense) => this.formatExpenseResponse(expense));
  }

  private formatExpenseResponse(expense: Expense) {
    return {
      id: expense.id,
      tripId: expense.tripId,
      title: expense.title,
      description: expense.description ?? null,
      amount: expense.amount,
      currency: expense.currency,
      status: expense.status ?? 'PENDING',
      paidBy: expense.payerId,
      paidByName: expense.payer?.nickname ?? 'Unknown',
      splitBetween:
        expense.debtors?.map((d) => d.debtor?.nickname ?? d.debtorId) ?? [],
      date: expense.date?.toISOString() ?? null,
      createdAt: expense.createdAt.toISOString(),
    };
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

    // Only payer or trip organizer can delete
    if (expense.payerId !== userId) {
      // Check if user is organizer of the trip
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

  async update(
    id: string,
    userId: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
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

    // Only payer or trip organizer can update
    if (expense.payerId !== userId) {
      const trip = await this.tripsService.findById(expense.tripId);
      const isOrganizer = trip.participants.some(
        (p) => p.userId === userId && p.role === ParticipantRole.ORGANIZER,
      );

      if (!isOrganizer) {
        throw new ForbiddenException(
          'You can only update your own expenses or if you are the organizer',
        );
      }
    }

    const { debtorIds, ...updateData } = updateExpenseDto;

    // Update basic expense fields
    if (updateData.title !== undefined) expense.title = updateData.title;
    if (updateData.description !== undefined)
      expense.description = updateData.description;
    if (updateData.amount !== undefined) expense.amount = updateData.amount;
    if (updateData.date !== undefined) expense.date = new Date(updateData.date);
    if (updateData.status !== undefined) expense.status = updateData.status;

    await this.expenseRepository.save(expense);

    // Update debtors if provided
    if (debtorIds !== undefined) {
      // Remove existing debtors
      await this.expenseDebtorRepository.delete({ expenseId: id });

      // Add new debtors
      if (debtorIds.length > 0) {
        const newDebtors = debtorIds.map((debtorId) =>
          this.expenseDebtorRepository.create({
            expenseId: id,
            debtorId,
          }),
        );
        await this.expenseDebtorRepository.save(newDebtors);
      }
    }

    this.logger.log(`Expense ${id} updated by user ${userId}`);

    return this.findOne(id);
  }

  async calculateBalance(tripId: string) {
    // Fetch raw expenses for calculation
    const expenses = await this.expenseRepository.find({
      where: { tripId },
      relations: ['payer', 'debtors', 'debtors.debtor'],
      order: { date: 'DESC' },
    });

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
    const debtorsList: { userId: string; amount: number }[] = [];

    for (const [userId, amount] of Object.entries(balances)) {
      if (amount > 0) creditors.push({ userId, amount });
      if (amount < 0) debtorsList.push({ userId, amount: -amount }); // Store positive magnitude
    }

    // Sort by amount descending to minimize transaction count
    creditors.sort((a, b) => b.amount - a.amount);
    debtorsList.sort((a, b) => b.amount - a.amount);

    const transactions: { from: string; to: string; amount: number }[] = [];

    let i = 0; // creditor index
    let j = 0; // debtor index

    while (i < creditors.length && j < debtorsList.length) {
      const creditor = creditors[i];
      const debtor = debtorsList[j];

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

    // Get user nicknames for settlements
    const userIds = new Set<string>();
    transactions.forEach((t) => {
      userIds.add(t.from);
      userIds.add(t.to);
    });

    // Fetch user names
    const users = await this.userRepository.findBy({
      id: In([...userIds]),
    });
    const userMap = new Map(users.map((u) => [u.id, u.nickname]));

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    return {
      settlements: transactions.map((t) => ({
        from: userMap.get(t.from) ?? t.from,
        to: userMap.get(t.to) ?? t.to,
        amount: t.amount,
      })),
      totalExpenses,
    };
  }

  /**
   * Calculate personal balance summary for a user
   * Returns: "Jesteś winien: X" and "Tobie winni: Y"
   */
  async calculateMyBalance(tripId: string, userId: string) {
    const expenses = await this.expenseRepository.find({
      where: { tripId },
      relations: ['payer', 'debtors', 'debtors.debtor'],
    });

    // Track what the user owes to others and what others owe to the user
    const owesToOthers: Record<string, number> = {}; // userId -> amount user owes them
    const othersOweMe: Record<string, number> = {}; // userId -> amount they owe user

    for (const expense of expenses) {
      if (!expense.debtors || expense.debtors.length === 0) continue;

      const totalAmount = expense.amount;
      const payerId = expense.payerId;
      const debtors = expense.debtors;
      const numberOfSplitters = debtors.length;
      const splitAmount = Math.floor(totalAmount / numberOfSplitters);
      const remainder = totalAmount % numberOfSplitters;

      // Calculate each debtor's share
      for (let i = 0; i < numberOfSplitters; i++) {
        const debtor = debtors[i];
        let shareAmount = splitAmount;
        if (i < remainder) {
          shareAmount += 1;
        }

        if (debtor.debtorId === userId && payerId !== userId) {
          // I'm a debtor and didn't pay -> I owe the payer
          owesToOthers[payerId] = (owesToOthers[payerId] || 0) + shareAmount;
        } else if (payerId === userId && debtor.debtorId !== userId) {
          // I'm the payer and this debtor is not me -> they owe me
          othersOweMe[debtor.debtorId] =
            (othersOweMe[debtor.debtorId] || 0) + shareAmount;
        }
      }
    }

    // Net the balances - if I owe someone 100 but they owe me 30, net is I owe 70
    const netBalances: Record<string, number> = {};
    const allUserIds = new Set([
      ...Object.keys(owesToOthers),
      ...Object.keys(othersOweMe),
    ]);

    for (const otherUserId of allUserIds) {
      const iOweThem = owesToOthers[otherUserId] || 0;
      const theyOweMe = othersOweMe[otherUserId] || 0;
      const netBalance = theyOweMe - iOweThem;
      if (netBalance !== 0) {
        netBalances[otherUserId] = netBalance;
      }
    }

    // Fetch user names
    const userIdsArray = [...allUserIds];
    const users =
      userIdsArray.length > 0
        ? await this.userRepository.findBy({ id: In(userIdsArray) })
        : [];
    const userMap = new Map(users.map((u) => [u.id, u.nickname]));

    // Get requesting user info
    const me = await this.userRepository.findOneBy({ id: userId });

    // Calculate totals
    let totalIOweThem = 0;
    let totalTheyOweMe = 0;

    const balances = Object.entries(netBalances).map(
      ([otherUserId, balance]) => {
        if (balance < 0) {
          totalIOweThem += Math.abs(balance);
        } else {
          totalTheyOweMe += balance;
        }

        return {
          userId: otherUserId,
          userName: userMap.get(otherUserId) ?? otherUserId,
          balance, // positive = they owe me, negative = I owe them
        };
      },
    );

    return {
      myUserId: userId,
      myUserName: me?.nickname ?? userId,
      balances,
      totalIOweThem,
      totalTheyOweMe,
    };
  }
}
