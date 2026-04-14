import { Test, TestingModule } from '@nestjs/testing';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TripAccessGuard } from '../trips/guards/trip-access.guard';

const mockFinanceService = {
  create: jest.fn(),
  findAllByTripPaginated: jest.fn(),
  findAllByTrip: jest.fn(),
  calculateBalance: jest.fn(),
  calculateMyBalance: jest.fn(),
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
    it('creates expense and delegates to service', async () => {
      const expense = makeExpense();
      mockFinanceService.create.mockResolvedValue(expense);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.create('trip-1', req, {
        title: 'Dinner',
        amount: 30,
        debtorIds: [],
      } as any);
      expect(result).toBe(expense);
      expect(mockFinanceService.create).toHaveBeenCalledWith('trip-1', 'user-1', expect.any(Object));
    });
  });

  describe('findAll', () => {
    it('returns paginated expense list', async () => {
      const paginatedResult = { data: [makeExpense()], meta: { total: 1, page: 1, limit: 20, totalPages: 1 } };
      mockFinanceService.findAllByTripPaginated.mockResolvedValue(paginatedResult);
      const result = await controller.findAll('trip-1', {} as any);
      expect(result).toBe(paginatedResult);
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

  describe('getMyBalance', () => {
    it('returns personal balance summary', async () => {
      const summary = { myUserId: 'user-1', balances: [] };
      mockFinanceService.calculateMyBalance.mockResolvedValue(summary);
      const req: any = { user: { userId: 'user-1' } };
      const result = await controller.getMyBalance('trip-1', req);
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
