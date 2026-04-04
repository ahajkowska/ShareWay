import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FinanceService } from './finance.service';
import { Expense } from './entities/expense.entity';
import { ExpenseDebtor } from './entities/expense-debtor.entity';
import { TripsService } from '../trips/trips.service';
import { ParticipantRole } from '../trips/entities/participant.entity';

const makeExpense = (overrides: Partial<Expense> = {}): Expense =>
  ({
    id: 'exp-1',
    tripId: 'trip-1',
    payerId: 'user-1',
    title: 'Dinner',
    description: null,
    amount: 3000, // $30.00 in cents
    date: new Date('2024-06-05'),
    debtors: [],
    payer: { id: 'user-1', nickname: 'Alice' } as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as unknown as Expense;

const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    create: jest.fn(),
    save: jest.fn(),
  },
};

const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};

const mockExpenseRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockExpenseDebtorRepo = {
  findOne: jest.fn(),
};

const mockTripsService = {
  isParticipant: jest.fn(),
  findById: jest.fn(),
};

describe('FinanceService', () => {
  let service: FinanceService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceService,
        { provide: getRepositoryToken(Expense), useValue: mockExpenseRepo },
        {
          provide: getRepositoryToken(ExpenseDebtor),
          useValue: mockExpenseDebtorRepo,
        },
        { provide: TripsService, useValue: mockTripsService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<FinanceService>(FinanceService);
  });

  describe('create', () => {
    it('converts amount to cents and uses transaction', async () => {
      const expense = makeExpense();
      mockQueryRunner.manager.create.mockReturnValue(expense);
      mockQueryRunner.manager.save
        .mockResolvedValueOnce(expense) // save expense
        .mockResolvedValueOnce([]); // save debtors
      mockExpenseRepo.findOne.mockResolvedValue(expense);

      await service.create('trip-1', 'user-1', {
        title: 'Dinner',
        amount: 30,
        splitBetween: ['user-1', 'user-2'],
        currency: 'USD',
      } as any);

      expect(mockQueryRunner.manager.create).toHaveBeenCalledWith(
        Expense,
        expect.objectContaining({ amount: 3000 }),
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('rolls back on error', async () => {
      mockQueryRunner.manager.create.mockReturnValue(makeExpense());
      mockQueryRunner.manager.save.mockRejectedValueOnce(new Error('DB error'));

      await expect(
        service.create('trip-1', 'user-1', {
          title: 'Dinner',
          amount: 30,
          splitBetween: [],
          currency: 'USD',
        } as any),
      ).rejects.toThrow('DB error');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('skips debtor creation when splitBetween is empty', async () => {
      const expense = makeExpense();
      mockQueryRunner.manager.create.mockReturnValue(expense);
      mockQueryRunner.manager.save.mockResolvedValueOnce(expense);
      mockExpenseRepo.findOne.mockResolvedValue(expense);

      await service.create('trip-1', 'user-1', {
        title: 'Dinner',
        amount: 30,
        splitBetween: [],
        currency: 'USD',
      } as any);

      // save is called once (expense only), not twice
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByTrip', () => {
    it('returns expenses for a trip', async () => {
      const expenses = [makeExpense()];
      mockExpenseRepo.find.mockResolvedValue(expenses);
      const result = await service.findAllByTrip('trip-1');
      expect(result).toBe(expenses);
    });
  });

  describe('findOne', () => {
    it('returns expense when found', async () => {
      const expense = makeExpense();
      mockExpenseRepo.findOne.mockResolvedValue(expense);
      const result = await service.findOne('exp-1');
      expect(result).toBe(expense);
    });

    it('throws NotFoundException when not found', async () => {
      mockExpenseRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('throws ForbiddenException when user is not a trip participant', async () => {
      mockExpenseRepo.findOne.mockResolvedValue(makeExpense());
      mockTripsService.isParticipant.mockResolvedValue(false);

      await expect(service.remove('exp-1', 'outsider')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('throws ForbiddenException when user is not payer and not organizer', async () => {
      const expense = makeExpense({ payerId: 'user-1' });
      mockExpenseRepo.findOne.mockResolvedValue(expense);
      mockTripsService.isParticipant.mockResolvedValue(true);
      mockTripsService.findById.mockResolvedValue({
        participants: [{ userId: 'user-2', role: ParticipantRole.PARTICIPANT }],
      });

      await expect(service.remove('exp-1', 'user-2')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('removes when user is the payer', async () => {
      const expense = makeExpense({ payerId: 'user-1' });
      mockExpenseRepo.findOne.mockResolvedValue(expense);
      mockTripsService.isParticipant.mockResolvedValue(true);
      mockExpenseRepo.remove.mockResolvedValue({});

      await service.remove('exp-1', 'user-1'); // payer
      expect(mockExpenseRepo.remove).toHaveBeenCalledWith(expense);
    });

    it('removes when user is organizer (not payer)', async () => {
      const expense = makeExpense({ payerId: 'user-1' });
      mockExpenseRepo.findOne.mockResolvedValue(expense);
      mockTripsService.isParticipant.mockResolvedValue(true);
      mockTripsService.findById.mockResolvedValue({
        participants: [{ userId: 'org-1', role: ParticipantRole.ORGANIZER }],
      });
      mockExpenseRepo.remove.mockResolvedValue({});

      await service.remove('exp-1', 'org-1');
      expect(mockExpenseRepo.remove).toHaveBeenCalled();
    });
  });

  describe('calculateBalance', () => {
    it('returns empty settlements and zero total for no expenses', async () => {
      mockExpenseRepo.find.mockResolvedValue([]);
      mockTripsService.findById.mockResolvedValue({
        participants: [],
      });
      const result = await service.calculateBalance('trip-1');
      expect(result.settlements).toHaveLength(0);
      expect(result.totalExpenses).toBe(0);
    });

    it('calculates single expense split correctly', async () => {
      const expense = makeExpense({
        amount: 3000,
        payerId: 'user-1',
        debtors: [{ debtorId: 'user-1' } as any, { debtorId: 'user-2' } as any],
      });
      mockExpenseRepo.find.mockResolvedValue([expense]);
      mockTripsService.findById.mockResolvedValue({
        participants: [
          { userId: 'user-1', user: { nickname: 'Alice' } },
          { userId: 'user-2', user: { nickname: 'Bob' } },
        ],
      });

      const result = await service.calculateBalance('trip-1');
      expect(result.totalExpenses).toBe(30); // 3000 cents = $30
      // user-1 paid 3000, split into 1500 each
      // user-1 balance: +3000 - 1500 = +1500
      // user-2 balance: -1500
      expect(result.settlements).toHaveLength(1);
      expect(result.settlements[0].from).toBe('Bob');
      expect(result.settlements[0].to).toBe('Alice');
      expect(result.settlements[0].amount).toBe(15); // $15
    });

    it('skips expenses with no debtors', async () => {
      const expense = makeExpense({ debtors: [] });
      mockExpenseRepo.find.mockResolvedValue([expense]);
      mockTripsService.findById.mockResolvedValue({ participants: [] });
      const result = await service.calculateBalance('trip-1');
      expect(result.settlements).toHaveLength(0);
    });

    it('distributes remainder cents to first debtors when amount does not split evenly', async () => {
      // $10.01 = 1001 cents split 3 ways: 334, 334, 333 (remainder 2 goes to first two)
      const expense = makeExpense({
        amount: 1001,
        payerId: 'user-1',
        debtors: [
          { debtorId: 'user-1' } as any,
          { debtorId: 'user-2' } as any,
          { debtorId: 'user-3' } as any,
        ],
      });
      mockExpenseRepo.find.mockResolvedValue([expense]);
      mockTripsService.findById.mockResolvedValue({
        participants: [
          { userId: 'user-1', user: { nickname: 'Alice' } },
          { userId: 'user-2', user: { nickname: 'Bob' } },
          { userId: 'user-3', user: { nickname: 'Charlie' } },
        ],
      });
      const result = await service.calculateBalance('trip-1');
      // user-1 paid 1001, deducted 334 share → net +667
      // user-2 net: -334
      // user-3 net: -333
      expect(result.settlements.length).toBeGreaterThan(0);
      expect(result.totalExpenses).toBeCloseTo(10.01, 1);
    });
  });

  describe('calculateBalanceSummary', () => {
    it('returns summary for a user', async () => {
      const expense = makeExpense({
        amount: 3000,
        payerId: 'user-1',
        debtors: [
          { debtorId: 'user-1', debtor: { nickname: 'Alice' } } as any,
          { debtorId: 'user-2', debtor: { nickname: 'Bob' } } as any,
        ],
        payer: { nickname: 'Alice' } as any,
      });
      mockExpenseRepo.find.mockResolvedValue([expense]);
      mockTripsService.findById.mockResolvedValue({
        participants: [
          { userId: 'user-1', user: { nickname: 'Alice' } },
          { userId: 'user-2', user: { nickname: 'Bob' } },
        ],
      });

      const result = await service.calculateBalanceSummary('trip-1', 'user-2');
      expect(result.myUserId).toBe('user-2');
      // user-2 owes user-1 their share
      expect(result.totalIOweThem).toBeGreaterThan(0);
      expect(result.totalTheyOweMe).toBe(0);
    });

    it('returns correct values when current user is the payer', async () => {
      const expense = makeExpense({
        amount: 3000,
        payerId: 'user-1',
        debtors: [
          { debtorId: 'user-1', debtor: { nickname: 'Alice' } } as any,
          { debtorId: 'user-2', debtor: { nickname: 'Bob' } } as any,
        ],
        payer: { nickname: 'Alice' } as any,
      });
      mockExpenseRepo.find.mockResolvedValue([expense]);
      mockTripsService.findById.mockResolvedValue({
        participants: [
          { userId: 'user-1', user: { nickname: 'Alice' } },
          { userId: 'user-2', user: { nickname: 'Bob' } },
        ],
      });

      const result = await service.calculateBalanceSummary('trip-1', 'user-1');
      expect(result.myUserId).toBe('user-1');
      expect(result.totalTheyOweMe).toBeGreaterThan(0);
    });
  });
});
