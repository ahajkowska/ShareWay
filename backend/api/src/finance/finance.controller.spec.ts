import { Test, TestingModule } from '@nestjs/testing';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TripAccessGuard } from '../trips/guards/trip-access.guard';

const mockFinanceService = {
  create: jest.fn(),
  findAllByTrip: jest.fn(),
  calculateBalance: jest.fn(),
  calculateBalanceSummary: jest.fn(),
  remove: jest.fn(),
};

const makeExpense = (overrides: any = {}) => ({
  id: 'exp-1',
  tripId: 'trip-1',
  payerId: 'user-1',
  title: 'Dinner',
  description: null,
  amount: 3000,
  date: new Date('2024-06-05'),
  payer: { nickname: 'Alice' },
  debtors: [{ debtor: { nickname: 'Alice' } }, { debtor: { nickname: 'Bob' } }],
  createdAt: new Date(),
  ...overrides,
});

describe('FinanceController', () => {
  let controller: FinanceController;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanceController],
      providers: [{ provide: FinanceService, useValue: mockFinanceService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(TripAccessGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FinanceController>(FinanceController);
  });

  describe('create', () => {
    it('creates expense and returns formatted response', async () => {
      const expense = makeExpense();
      mockFinanceService.create.mockResolvedValue(expense);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.create('trip-1', req, {
        title: 'Dinner',
        amount: 30,
        splitBetween: [],
      } as any);
      expect(result).toMatchObject({ id: 'exp-1', amount: 30 }); // 3000 / 100
    });
  });

  describe('findAll', () => {
    it('returns formatted expense list', async () => {
      mockFinanceService.findAllByTrip.mockResolvedValue([makeExpense()]);
      const result = await controller.findAll('trip-1');
      expect(result).toHaveLength(1);
      expect(result[0].amount).toBe(30);
    });
  });

  describe('getBalance', () => {
    it('returns balance data', async () => {
      const balance = { settlements: [], totalExpenses: 0 };
      mockFinanceService.calculateBalance.mockResolvedValue(balance);
      const result = await controller.getBalance('trip-1');
      expect(result).toBe(balance);
    });
  });

  describe('getBalanceSummary', () => {
    it('returns balance summary', async () => {
      const summary = { myUserId: 'user-1', balances: [] };
      mockFinanceService.calculateBalanceSummary.mockResolvedValue(summary);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.getBalanceSummary('trip-1', req);
      expect(result).toBe(summary);
    });
  });

  describe('remove', () => {
    it('delegates to financeService.remove', async () => {
      mockFinanceService.remove.mockResolvedValue(undefined);
      const req: any = { user: { userId: 'user-1' } };
      await controller.remove('exp-1', req);
      expect(mockFinanceService.remove).toHaveBeenCalledWith('exp-1', 'user-1');
    });
  });
});
