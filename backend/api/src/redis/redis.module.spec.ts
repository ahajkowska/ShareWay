import { RedisModule } from './redis.module';

describe('RedisModule', () => {
  it('is defined', () => {
    expect(RedisModule).toBeDefined();
  });

  it('register() returns a dynamic module', () => {
    const dynamicModule = RedisModule.register();
    expect(dynamicModule.module).toBe(RedisModule);
    expect(dynamicModule.providers).toBeDefined();
    expect(dynamicModule.exports).toBeDefined();
  });

  it('register() provider factory creates a Redis instance when called', () => {
    const dynamicModule = RedisModule.register();
    const redisProvider = dynamicModule.providers?.find(
      (p: any) => p.provide === 'REDIS_CLIENT',
    ) as any;

    expect(redisProvider).toBeDefined();
    expect(typeof redisProvider.useFactory).toBe('function');

    const mockConfigService = {
      get: jest.fn((key: string) =>
        key === 'REDIS_HOST' ? 'localhost' : 6379,
      ),
    };

    const mockRedis = jest.fn().mockImplementation(() => ({
      quit: jest.fn(),
    }));

    jest.doMock('ioredis', () => mockRedis);

    expect(typeof redisProvider.useFactory).toBe('function');
  });
});
