import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { REDIS_CLIENT } from './redis.module';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_token'),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

const mockRedisClient = {
  setex: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
  quit: jest.fn(),
};

describe('RedisRepository', () => {
  let repository: RedisRepository;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisRepository,
        { provide: REDIS_CLIENT, useValue: mockRedisClient },
      ],
    }).compile();

    repository = module.get<RedisRepository>(RedisRepository);
  });

  describe('storeRefreshToken', () => {
    it('stores hashed token in redis with TTL', async () => {
      await repository.storeRefreshToken('user1', 'raw_token');
      expect(bcrypt.hash).toHaveBeenCalledWith('raw_token', 10);
      expect(mockRedisClient.setex).toHaveBeenCalledWith(
        'refresh_token:user1',
        7 * 24 * 60 * 60,
        expect.stringContaining('hashed_token'),
      );
    });
  });

  describe('validateRefreshToken', () => {
    it('throws UnauthorizedException when key not found', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      await expect(
        repository.validateRefreshToken('user1', 'token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when hash does not match', async () => {
      mockRedisClient.get.mockResolvedValue(
        JSON.stringify({
          tokenHash: 'wrong',
          createdAt: new Date().toISOString(),
        }),
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(
        repository.validateRefreshToken('user1', 'bad_token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns true when token is valid', async () => {
      mockRedisClient.get.mockResolvedValue(
        JSON.stringify({
          tokenHash: 'hashed_token',
          createdAt: new Date().toISOString(),
        }),
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await repository.validateRefreshToken(
        'user1',
        'good_token',
      );
      expect(result).toBe(true);
    });
  });

  describe('removeRefreshToken', () => {
    it('deletes the key from redis', async () => {
      await repository.removeRefreshToken('user1');
      expect(mockRedisClient.del).toHaveBeenCalledWith('refresh_token:user1');
    });
  });

  describe('rotateRefreshToken', () => {
    it('validates old token, removes it, stores new one', async () => {
      mockRedisClient.get.mockResolvedValue(
        JSON.stringify({
          tokenHash: 'hashed_token',
          createdAt: new Date().toISOString(),
        }),
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await repository.rotateRefreshToken('user1', 'old_token', 'new_token');

      expect(mockRedisClient.del).toHaveBeenCalledWith('refresh_token:user1');
      expect(mockRedisClient.setex).toHaveBeenCalledWith(
        'refresh_token:user1',
        expect.any(Number),
        expect.any(String),
      );
    });

    it('throws if old token is invalid', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      await expect(
        repository.rotateRefreshToken('user1', 'bad', 'new'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('onModuleDestroy', () => {
    it('calls quit on redis client', async () => {
      await repository.onModuleDestroy();
      expect(mockRedisClient.quit).toHaveBeenCalled();
    });
  });
});
