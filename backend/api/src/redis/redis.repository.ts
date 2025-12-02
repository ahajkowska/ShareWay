import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.module';
import Redis from 'ioredis';

export type SessionRecord = {
  userId: string;
  refreshTokenHash: string;
  createdAt: string;
  sessionExpiryTimestampMs: string;
  // userAgent: string;
  // ipAddress: string;
  // Do we need that additional logic?
};

@Injectable()
export class RedisRepository implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  async onModuleDestroy(): Promise<void> {
    await this.redisClient.quit();
  }

  // sessionId would be retrieved from the JWT token's payload
  async storeSession(sessionRecord: SessionRecord, sessionId: string) {
    const { userId, sessionExpiryTimestampMs } = sessionRecord;
    const sessionKey = this.retrieveSessionKey(userId, sessionId);
    const ttl = Math.floor((+sessionExpiryTimestampMs - Date.now()) / 1000);

    await this.redisClient
      .multi()
      .hset(sessionKey, sessionRecord)
      .expire(sessionKey, ttl)
      .exec();
  }

  private retrieveSessionKey(userId: string, sessionId: string) {
    return `sess:${userId}:${sessionId}`;
  }
}
