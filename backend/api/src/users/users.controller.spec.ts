import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from './entities/user.entity';

const mockUsersService = {
  findById: jest.fn(),
  updateProfile: jest.fn(),
  changePassword: jest.fn(),
};

const makeUser = (overrides = {}) => ({
  id: 'uuid-1',
  email: 'test@example.com',
  nickname: 'Tester',
  role: UserRole.USER,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('getProfile', () => {
    it('returns null when no userId', async () => {
      const req: any = { user: undefined };
      expect(await controller.getProfile(req)).toBeNull();
    });

    it('throws NotFoundException when user not found', async () => {
      mockUsersService.findById.mockResolvedValue(null);
      const req: any = { user: { userId: 'uuid-1' } };
      await expect(controller.getProfile(req)).rejects.toThrow(
        'User not found',
      );
    });

    it('returns user profile shape', async () => {
      const user = makeUser();
      mockUsersService.findById.mockResolvedValue(user);
      const req: any = { user: { userId: 'uuid-1' } };
      const result = await controller.getProfile(req);
      expect(result).toMatchObject({
        id: 'uuid-1',
        email: 'test@example.com',
        nickname: 'Tester',
        role: UserRole.USER,
      });
    });
  });

  describe('updateProfile', () => {
    it('returns null when no userId', async () => {
      const req: any = { user: undefined };
      expect(
        await controller.updateProfile(req, { nickname: 'New' }),
      ).toBeNull();
    });

    it('returns updated profile', async () => {
      const user = makeUser({ nickname: 'New' });
      mockUsersService.updateProfile.mockResolvedValue(user);
      const req: any = { user: { userId: 'uuid-1' } };
      const result = await controller.updateProfile(req, { nickname: 'New' });
      expect(result?.nickname).toBe('New');
    });
  });

  describe('changePassword', () => {
    it('returns error message when no userId', async () => {
      const req: any = { user: undefined };
      const result = await controller.changePassword(req, {
        oldPassword: 'old',
        newPassword: 'new',
        confirmPassword: 'new',
      });
      expect(result).toEqual({ message: 'User not found' });
    });

    it('delegates to usersService.changePassword', async () => {
      mockUsersService.changePassword.mockResolvedValue({
        message: 'Password changed successfully',
      });
      const req: any = { user: { userId: 'uuid-1' } };
      const result = await controller.changePassword(req, {
        oldPassword: 'old',
        newPassword: 'new123',
        confirmPassword: 'new123',
      });
      expect(result).toEqual({ message: 'Password changed successfully' });
    });
  });
});
