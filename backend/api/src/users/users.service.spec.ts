import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_pw'),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

const mockUsersRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(),
  update: jest.fn(),
  findAndCount: jest.fn(),
};

const makeUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'uuid-1',
    email: 'test@example.com',
    password: 'hashed_pw',
    nickname: 'Tester',
    role: UserRole.USER,
    isActive: true,
    passwordResetToken: null,
    passwordResetExpires: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  }) as User;

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('hashes the password and saves the user', async () => {
      const user = makeUser();
      mockUsersRepository.create.mockReturnValue(user);
      mockUsersRepository.save.mockResolvedValue(user);

      const result = await service.create({
        email: 'test@example.com',
        password: 'plain',
        nickname: 'Tester',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
      expect(mockUsersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com', password: 'hashed_pw' }),
      );
      expect(result).toBe(user);
    });
  });

  describe('findByEmail', () => {
    it('returns user when found', async () => {
      const user = makeUser();
      mockUsersRepository.findOne.mockResolvedValue(user);
      const result = await service.findByEmail('test@example.com');
      expect(result).toBe(user);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('returns null when not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      const result = await service.findByEmail('nobody@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('returns user when found', async () => {
      const user = makeUser();
      mockUsersRepository.findOne.mockResolvedValue(user);
      const result = await service.findById('uuid-1');
      expect(result).toBe(user);
    });

    it('returns null when not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      expect(await service.findById('unknown')).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('returns true when passwords match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      expect(await service.validatePassword('plain', 'hashed')).toBe(true);
    });

    it('returns false when passwords do not match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      expect(await service.validatePassword('wrong', 'hashed')).toBe(false);
    });
  });

  describe('emailExists', () => {
    it('returns true when count > 0', async () => {
      mockUsersRepository.count.mockResolvedValue(1);
      expect(await service.emailExists('test@example.com')).toBe(true);
    });

    it('returns false when count is 0', async () => {
      mockUsersRepository.count.mockResolvedValue(0);
      expect(await service.emailExists('new@example.com')).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('throws BadRequestException when user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(
        service.updateProfile('uuid-1', { nickname: 'New' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('updates nickname when provided', async () => {
      const user = makeUser();
      mockUsersRepository.findOne.mockResolvedValue(user);
      mockUsersRepository.save.mockResolvedValue({ ...user, nickname: 'New' });
      const result = await service.updateProfile('uuid-1', { nickname: 'New' });
      expect(result.nickname).toBe('New');
    });

    it('does not change nickname when not provided', async () => {
      const user = makeUser({ nickname: 'Original' });
      mockUsersRepository.findOne.mockResolvedValue(user);
      mockUsersRepository.save.mockResolvedValue(user);
      await service.updateProfile('uuid-1', {});
      expect(user.nickname).toBe('Original');
    });
  });

  describe('changePassword', () => {
    it('throws BadRequestException when new passwords do not match', async () => {
      await expect(
        service.changePassword('uuid-1', {
          oldPassword: 'old',
          newPassword: 'newA',
          confirmPassword: 'newB',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(
        service.changePassword('uuid-1', {
          oldPassword: 'old',
          newPassword: 'new123',
          confirmPassword: 'new123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when old password is incorrect', async () => {
      mockUsersRepository.findOne.mockResolvedValue(makeUser());
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(
        service.changePassword('uuid-1', {
          oldPassword: 'wrong',
          newPassword: 'new123',
          confirmPassword: 'new123',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('updates password successfully', async () => {
      const user = makeUser();
      mockUsersRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUsersRepository.save.mockResolvedValue(user);

      const result = await service.changePassword('uuid-1', {
        oldPassword: 'old',
        newPassword: 'new123',
        confirmPassword: 'new123',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('new123', 10);
      expect(result).toEqual({ message: 'Password changed successfully' });
    });
  });

  describe('setPasswordResetToken', () => {
    it('calls update with token and expiry', async () => {
      const expires = new Date();
      mockUsersRepository.update.mockResolvedValue({});
      await service.setPasswordResetToken('uuid-1', 'token123', expires);
      expect(mockUsersRepository.update).toHaveBeenCalledWith('uuid-1', {
        passwordResetToken: 'token123',
        passwordResetExpires: expires,
      });
    });
  });

  describe('findByPasswordResetToken', () => {
    it('returns user by reset token', async () => {
      const user = makeUser({ passwordResetToken: 'tok' });
      mockUsersRepository.findOne.mockResolvedValue(user);
      const result = await service.findByPasswordResetToken('tok');
      expect(result).toBe(user);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { passwordResetToken: 'tok' },
      });
    });
  });

  describe('resetPassword', () => {
    it('hashes new password and clears token fields', async () => {
      mockUsersRepository.update.mockResolvedValue({});
      await service.resetPassword('uuid-1', 'newpass');
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
      expect(mockUsersRepository.update).toHaveBeenCalledWith('uuid-1', {
        password: 'hashed_pw',
        passwordResetToken: null,
        passwordResetExpires: null,
      });
    });
  });

  describe('setUserActiveStatus', () => {
    it('calls update with isActive flag', async () => {
      mockUsersRepository.update.mockResolvedValue({});
      await service.setUserActiveStatus('uuid-1', false);
      expect(mockUsersRepository.update).toHaveBeenCalledWith('uuid-1', {
        isActive: false,
      });
    });
  });

  describe('findAllPaginated', () => {
    it('returns paginated result', async () => {
      const users = [makeUser()];
      mockUsersRepository.findAndCount.mockResolvedValue([users, 1]);
      const result = await service.findAllPaginated(1, 10);
      expect(result).toEqual({ users, total: 1, page: 1, limit: 10 });
    });

    it('calculates correct skip for page 2', async () => {
      mockUsersRepository.findAndCount.mockResolvedValue([[], 0]);
      await service.findAllPaginated(2, 10);
      expect(mockUsersRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 }),
      );
    });
  });
});
