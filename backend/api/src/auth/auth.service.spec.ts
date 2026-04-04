import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RedisRepository } from '../redis/redis.repository';
import { MailerService } from '../mailer/mailer.service';
import { UserRole } from '../users/entities/user.entity';

const mockUsersService = {
  emailExists: jest.fn(),
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  validatePassword: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('jwt_token'),
};

const mockConfigService = {
  getOrThrow: jest.fn().mockReturnValue('secret'),
};

const mockRedisRepository = {
  storeRefreshToken: jest.fn(),
  removeRefreshToken: jest.fn(),
  rotateRefreshToken: jest.fn(),
};

const mockEventEmitter = {
  emit: jest.fn(),
};

const mockMailerService = {
  sendWelcomeEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
};

const makeUser = (overrides = {}) => ({
  id: 'uuid-1',
  email: 'test@example.com',
  password: 'hashed_pw',
  nickname: 'Tester',
  role: UserRole.USER,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: RedisRepository, useValue: mockRedisRepository },
        { provide: EventEmitter2, useValue: mockEventEmitter },
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('throws BadRequestException when email already exists', async () => {
      mockUsersService.emailExists.mockResolvedValue(true);
      await expect(
        service.register({ email: 'test@example.com', password: 'pass', nickname: 'T' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('creates user, emits event, sends welcome email', async () => {
      mockUsersService.emailExists.mockResolvedValue(false);
      const user = makeUser();
      mockUsersService.create.mockResolvedValue(user);
      mockMailerService.sendWelcomeEmail.mockResolvedValue(undefined);

      const result = await service.register({
        email: 'test@example.com',
        password: 'pass',
        nickname: 'Tester',
      });

      expect(mockUsersService.create).toHaveBeenCalled();
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'user.registered',
        expect.objectContaining({ email: 'test@example.com' }),
      );
      expect(mockMailerService.sendWelcomeEmail).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' }),
      );
      expect(result).toEqual({ message: 'Registration successful' });
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      await expect(
        service.login({ email: 'x@x.com', password: 'pw' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when account is deactivated', async () => {
      mockUsersService.findByEmail.mockResolvedValue(makeUser({ isActive: false }));
      await expect(
        service.login({ email: 'test@example.com', password: 'pw' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(makeUser());
      mockUsersService.validatePassword.mockResolvedValue(false);
      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns token pair and stores refresh token on success', async () => {
      mockUsersService.findByEmail.mockResolvedValue(makeUser());
      mockUsersService.validatePassword.mockResolvedValue(true);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access_tok')
        .mockResolvedValueOnce('refresh_tok');

      const result = await service.login({
        email: 'test@example.com',
        password: 'correct',
      });

      expect(result).toEqual({
        accessToken: 'access_tok',
        refreshToken: 'refresh_tok',
      });
      expect(mockRedisRepository.storeRefreshToken).toHaveBeenCalledWith(
        'uuid-1',
        'refresh_tok',
      );
    });
  });

  describe('logout', () => {
    it('removes refresh token from redis', async () => {
      const result = await service.logout('uuid-1');
      expect(mockRedisRepository.removeRefreshToken).toHaveBeenCalledWith('uuid-1');
      expect(result).toEqual({ message: 'Logout successful' });
    });
  });

  describe('refresh', () => {
    it('throws UnauthorizedException when user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);
      await expect(
        service.refresh('uuid-1', 'old_refresh'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when user is inactive', async () => {
      mockUsersService.findById.mockResolvedValue(makeUser({ isActive: false }));
      await expect(
        service.refresh('uuid-1', 'old_refresh'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns new token pair and rotates refresh token', async () => {
      mockUsersService.findById.mockResolvedValue(makeUser());
      mockJwtService.signAsync
        .mockResolvedValueOnce('new_access')
        .mockResolvedValueOnce('new_refresh');

      const result = await service.refresh('uuid-1', 'old_refresh');

      expect(result).toEqual({
        accessToken: 'new_access',
        refreshToken: 'new_refresh',
      });
      expect(mockRedisRepository.rotateRefreshToken).toHaveBeenCalledWith(
        'uuid-1',
        'old_refresh',
        'new_refresh',
      );
    });
  });
});
