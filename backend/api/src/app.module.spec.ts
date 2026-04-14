jest.mock('./validation/env-validation', () => ({
  validate: () => ({
    API_PORT: 3000,
    REDIS_PORT: 6379,
    REDIS_HOST: 'localhost',
    DATABASE_HOST: 'localhost',
    DATABASE_PORT: 5432,
    DATABASE_USER: 'postgres',
    POSTGRES_PASSWORD: 'password',
    DATABASE_NAME: 'shareway',
    JWT_SECRET: 'test-secret',
    JWT_REFRESH_SECRET: 'test-refresh-secret',
  }),
}));

import { AppModule } from './app.module';

describe('AppModule (import-time coverage)', () => {
  it('module is defined after import', () => {
    expect(AppModule).toBeDefined();
  });
});
