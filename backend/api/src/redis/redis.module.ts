import { DynamicModule, Module } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({})
export class RedisModule {
  static register(): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_CLIENT,
          useFactory: (configService: ConfigService): Redis => {
            return new Redis({
              host: configService.get<string>('REDIS_HOST'),
              port: configService.get<number>('REDIS_PORT'),
            });
          },
          inject: [ConfigService],
        },
        RedisRepository,
      ],
      exports: [REDIS_CLIENT, RedisRepository],
    };
  }
}
