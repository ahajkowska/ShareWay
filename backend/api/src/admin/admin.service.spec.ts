import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { RedisRepository } from '../redis/redis.repository';
import { MailerService } from '../mailer/mailer.service';
import { UserRole } from '../users/entities/user.entity';

const makeUser = (overrides = {}) => ({
  id: 'uuid-1',
  email: 'user@example.com',
  nickname: 'TestUser',
  role: UserRole.USER,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const mockUsersService = {
  findById: jest.fn(),
  setUserActiveStatus: jest.fn(),
  setPasswordResetToken: jest.fn(),
  findAllPaginated: jest.fn(),
};

const mockRedisRepository = {
  removeRefreshToken: jest.fn(),
};

const mockMailerService = {
  sendAccountBannedEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('http://localhost:3000'),
};

describe('AdminService', () => {
  let service: AdminService;

  beforeEach(async () => {
    jest.resetAllMocks();
    mockConfigService.get.mockReturnValue('http://localhost:3000');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: RedisRepository, useValue: mockRedisRepository },
        { provide: MailerService, useValue: mockMailerService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  describe('getAllUsers', () => {
    it('delegates to usersService.findAllPaginated', async () => {
      const paginated = { users: [], total: 0, page: 1, limit: 20 };
      mockUsersService.findAllPaginated.mockResolvedValue(paginated);
      const result = await service.getAllUsers(1, 20);
      expect(result).toBe(paginated);
      expect(mockUsersService.findAllPaginated).toHaveBeenCalledWith(1, 20);
    });
  });

  describe('banUser', () => {
    it('throws NotFoundException when user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);
      await expect(service.banUser('uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws BadRequestException when user is already banned', async () => {
      mockUsersService.findById.mockResolvedValue(
        makeUser({ isActive: false }),
      );
      await expect(service.banUser('uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('bans user, removes redis token, sends email', async () => {
      const user = makeUser();
      mockUsersService.findById.mockResolvedValue(user);
      mockUsersService.setUserActiveStatus.mockResolvedValue(undefined);
      mockRedisRepository.removeRefreshToken.mockResolvedValue(undefined);
      mockMailerService.sendAccountBannedEmail.mockResolvedValue(undefined);

      const result = await service.banUser('uuid-1');

      expect(mockUsersService.setUserActiveStatus).toHaveBeenCalledWith(
        'uuid-1',
        false,
      );
      expect(mockRedisRepository.removeRefreshToken).toHaveBeenCalledWith(
        'uuid-1',
      );
      expect(mockMailerService.sendAccountBannedEmail).toHaveBeenCalledWith(
        user.email,
        user.nickname,
      );
      expect(result).toEqual({ message: 'User has been banned successfully' });
    });
  });

  describe('unbanUser', () => {
    it('throws NotFoundException when user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);
      await expect(service.unbanUser('uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws BadRequestException when user is not banned', async () => {
      mockUsersService.findById.mockResolvedValue(makeUser({ isActive: true }));
      await expect(service.unbanUser('uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('unbans user successfully', async () => {
      mockUsersService.findById.mockResolvedValue(
        makeUser({ isActive: false }),
      );
      mockUsersService.setUserActiveStatus.mockResolvedValue(undefined);

      const result = await service.unbanUser('uuid-1');
      expect(mockUsersService.setUserActiveStatus).toHaveBeenCalledWith(
        'uuid-1',
        true,
      );
      expect(result).toEqual({
        message: 'User has been unbanned successfully',
      });
    });
  });

  describe('initiatePasswordReset', () => {
    it('throws NotFoundException when user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);
      await expect(service.initiatePasswordReset('uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('generates reset token, stores it, and sends email', async () => {
      const user = makeUser();
      mockUsersService.findById.mockResolvedValue(user);
      mockUsersService.setPasswordResetToken.mockResolvedValue(undefined);
      mockMailerService.sendPasswordResetEmail.mockResolvedValue(undefined);

      const result = await service.initiatePasswordReset('uuid-1');

      expect(mockUsersService.setPasswordResetToken).toHaveBeenCalledWith(
        'uuid-1',
        expect.any(String),
        expect.any(Date),
      );
      expect(mockMailerService.sendPasswordResetEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: user.email,
          resetToken: expect.any(String),
          resetUrl: expect.any(String),
        }),
      );
      expect(result).toEqual({
        message: 'Password reset email has been sent to the user',
      });
    });
  });

  describe('getUserById', () => {
    it('throws NotFoundException when user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);
      await expect(service.getUserById('uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns user data when found', async () => {
      const user = makeUser();
      mockUsersService.findById.mockResolvedValue(user);
      const result = await service.getUserById('uuid-1');
      expect(result).toEqual({
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });
  });
});
