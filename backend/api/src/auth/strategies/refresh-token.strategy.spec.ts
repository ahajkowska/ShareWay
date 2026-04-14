import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenStrategy } from './refresh-token.strategy';
import { RedisRepository } from '../../redis/redis.repository';
import { UsersService } from '../../users/users.service';

const mockConfigService = {
  getOrThrow: jest.fn().mockReturnValue('test_refresh_secret'),
};

const mockRedisRepository = {
  validateRefreshToken: jest.fn(),
};

const mockUsersService = {
  findById: jest.fn(),
};

describe('RefreshTokenStrategy', () => {
  let strategy: RefreshTokenStrategy;

  beforeEach(async () => {
    jest.resetAllMocks();
    mockConfigService.getOrThrow.mockReturnValue('test_refresh_secret');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenStrategy,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: RedisRepository, useValue: mockRedisRepository },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    strategy = module.get<RefreshTokenStrategy>(RefreshTokenStrategy);
  });

  describe('cookie extractor', () => {
    it('returns refresh_token from cookies when present', () => {
      const extractor = (strategy as any)._jwtFromRequest;
      const req: any = { cookies: { refresh_token: 'rt_token' } };
      expect(extractor(req)).toBe('rt_token');
    });

    it('returns null when no refresh_token cookie', () => {
      const extractor = (strategy as any)._jwtFromRequest;
      const req: any = { cookies: {} };
      expect(extractor(req)).toBeNull();
    });
  });

  describe('validate', () => {
    it('throws UnauthorizedException when no refresh token in cookies', async () => {
      const req: any = { cookies: {} };
      await expect(
        strategy.validate(req, { sub: 'uuid-1' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when redis validation fails', async () => {
      const req: any = { cookies: { refresh_token: 'bad_token' } };
      mockRedisRepository.validateRefreshToken.mockRejectedValue(
        new UnauthorizedException('Invalid'),
      );
      await expect(
        strategy.validate(req, { sub: 'uuid-1' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when user is not found or inactive', async () => {
      const req: any = { cookies: { refresh_token: 'valid_token' } };
      mockRedisRepository.validateRefreshToken.mockResolvedValue(true);
      mockUsersService.findById.mockResolvedValue(null);
      await expect(
        strategy.validate(req, { sub: 'uuid-1' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns userId and refreshToken on success', async () => {
      const req: any = { cookies: { refresh_token: 'valid_token' } };
      mockRedisRepository.validateRefreshToken.mockResolvedValue(true);
      mockUsersService.findById.mockResolvedValue({ id: 'uuid-1', isActive: true });
      const result = await strategy.validate(req, { sub: 'uuid-1' });
      expect(result).toEqual({ userId: 'uuid-1', refreshToken: 'valid_token' });
    });
  });
});
