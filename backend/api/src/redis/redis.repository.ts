import {
  Inject,
  Injectable,
  OnModuleDestroy,
  UnauthorizedException,
} from '@nestjs/common';
import { REDIS_CLIENT } from './redis.module.js';
import Redis from 'ioredis';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

@Injectable()
export class RedisRepository implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  async onModuleDestroy(): Promise<void> {
    await this.redisClient.quit();
  }

  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const key = this.getRefreshTokenKey(userId);
    const tokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);

    await this.redisClient.setex(
      key,
      REFRESH_TOKEN_TTL_SECONDS,
      JSON.stringify({
        tokenHash,
        createdAt: new Date().toISOString(),
      }),
    );
  }

  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const key = this.getRefreshTokenKey(userId);
    const stored = await this.redisClient.get(key);

    if (!stored) {
      throw new UnauthorizedException('Refresh token not found or expired');
    }

    const { tokenHash } = JSON.parse(stored);
    const isValid = await bcrypt.compare(refreshToken, tokenHash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return true;
  }

  async removeRefreshToken(userId: string): Promise<void> {
    const key = this.getRefreshTokenKey(userId);
    await this.redisClient.del(key);
  }

  async rotateRefreshToken(
    userId: string,
    oldRefreshToken: string,
    newRefreshToken: string,
  ): Promise<void> {
    await this.validateRefreshToken(userId, oldRefreshToken);
    await this.removeRefreshToken(userId);
    await this.storeRefreshToken(userId, newRefreshToken);
  }

  private getRefreshTokenKey(userId: string): string {
    return `refresh_token:${userId}`;
  }
}
