import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../../users/users.service';
import { UserRole } from '../../users/entities/user.entity';

const mockConfigService = {
  getOrThrow: jest.fn().mockReturnValue('test_jwt_secret'),
};

const mockUsersService = {
  findById: jest.fn(),
};

const makeUser = (overrides = {}) => ({
  id: 'uuid-1',
  email: 'test@example.com',
  role: UserRole.USER,
  isActive: true,
  ...overrides,
});

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    jest.resetAllMocks();
    mockConfigService.getOrThrow.mockReturnValue('test_jwt_secret');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('cookie extractor', () => {
    it('returns access_token from cookies when present', () => {
      const extractor = (strategy as any)._jwtFromRequest;
      const req: any = { cookies: { access_token: 'my_token' } };
      expect(extractor(req)).toBe('my_token');
    });

    it('returns null when no cookies', () => {
      const extractor = (strategy as any)._jwtFromRequest;
      const req: any = { cookies: {} };
      expect(extractor(req)).toBeNull();
    });

    it('returns null when request has no cookies property', () => {
      const extractor = (strategy as any)._jwtFromRequest;
      expect(extractor(null)).toBeNull();
    });
  });

  describe('validate', () => {
    it('throws UnauthorizedException when user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);
      await expect(
        strategy.validate({ sub: 'uuid-1', email: 'test@example.com' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when user is inactive', async () => {
      mockUsersService.findById.mockResolvedValue(makeUser({ isActive: false }));
      await expect(
        strategy.validate({ sub: 'uuid-1', email: 'test@example.com' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns userId and email when valid', async () => {
      mockUsersService.findById.mockResolvedValue(makeUser());
      const result = await strategy.validate({
        sub: 'uuid-1',
        email: 'test@example.com',
      });
      expect(result).toEqual({ userId: 'uuid-1', email: 'test@example.com' });
    });
  });
});
