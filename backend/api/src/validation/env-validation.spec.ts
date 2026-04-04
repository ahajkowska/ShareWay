import 'reflect-metadata';
import { validate } from './env-validation';

const validConfig: Record<string, unknown> = {
  API_PORT: 3000,
  REDIS_PORT: 6379,
  REDIS_HOST: 'localhost',
  DATABASE_HOST: 'localhost',
  DATABASE_PORT: 5432,
  DATABASE_USER: 'postgres',
  POSTGRES_PASSWORD: 'password',
  DATABASE_NAME: 'shareway',
  JWT_SECRET: 'test-jwt-secret',
  JWT_REFRESH_SECRET: 'test-refresh-secret',
};

describe('validate', () => {
  it('returns validated config for valid environment', () => {
    const result = validate(validConfig);
    expect(result.API_PORT).toBe(3000);
    expect(result.JWT_SECRET).toBe('test-jwt-secret');
    expect(result.JWT_REFRESH_SECRET).toBe('test-refresh-secret');
  });

  it('converts string numbers to numbers via implicit conversion', () => {
    const result = validate({
      ...validConfig,
      API_PORT: '3001',
      REDIS_PORT: '6380',
      DATABASE_PORT: '5433',
    });
    expect(result.API_PORT).toBe(3001);
    expect(result.REDIS_PORT).toBe(6380);
    expect(result.DATABASE_PORT).toBe(5433);
  });

  it('throws when required fields are missing', () => {
    const { JWT_SECRET: _, ...withoutJwtSecret } = validConfig;
    expect(() => validate(withoutJwtSecret)).toThrow();
  });

  it('throws when required string field is missing', () => {
    const { DATABASE_HOST: _, ...withoutHost } = validConfig;
    expect(() => validate(withoutHost)).toThrow();
  });

  it('includes optional mail fields when provided', () => {
    const result = validate({
      ...validConfig,
      MAIL_HOST: 'smtp.example.com',
      MAIL_PORT: 587,
      MAIL_SECURE: false,
      MAIL_USER: 'user@example.com',
      MAIL_PASSWORD: 'mailpass',
      MAIL_FROM: '"Test" <test@example.com>',
      APP_URL: 'http://localhost:3000',
    });
    expect(result.MAIL_HOST).toBe('smtp.example.com');
    expect(result.APP_URL).toBe('http://localhost:3000');
  });

  it('succeeds without optional fields', () => {
    expect(() => validate(validConfig)).not.toThrow();
  });
});
