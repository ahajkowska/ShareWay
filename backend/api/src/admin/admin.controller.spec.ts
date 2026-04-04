import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

const mockAdminService = {
  getAllUsers: jest.fn(),
  getUserById: jest.fn(),
  banUser: jest.fn(),
  unbanUser: jest.fn(),
  initiatePasswordReset: jest.fn(),
};

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockAdminService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AdminController>(AdminController);
  });

  describe('getAllUsers', () => {
    it('delegates with pagination params', async () => {
      const paginated = { users: [], total: 0, page: 1, limit: 20 };
      mockAdminService.getAllUsers.mockResolvedValue(paginated);
      const result = await controller.getAllUsers({
        page: 1,
        limit: 20,
      } as any);
      expect(result).toBe(paginated);
      expect(mockAdminService.getAllUsers).toHaveBeenCalledWith(1, 20);
    });
  });

  describe('getUserById', () => {
    it('delegates to adminService.getUserById', async () => {
      const userData = { id: 'uuid-1', email: 'a@b.com' };
      mockAdminService.getUserById.mockResolvedValue(userData);
      const result = await controller.getUserById('uuid-1');
      expect(result).toBe(userData);
    });
  });

  describe('banUser', () => {
    it('delegates to adminService.banUser', async () => {
      mockAdminService.banUser.mockResolvedValue({
        message: 'User has been banned successfully',
      });
      const result = await controller.banUser('uuid-1');
      expect(result).toEqual({ message: 'User has been banned successfully' });
    });
  });

  describe('unbanUser', () => {
    it('delegates to adminService.unbanUser', async () => {
      mockAdminService.unbanUser.mockResolvedValue({
        message: 'User has been unbanned successfully',
      });
      const result = await controller.unbanUser('uuid-1');
      expect(result).toEqual({
        message: 'User has been unbanned successfully',
      });
    });
  });

  describe('resetPassword', () => {
    it('delegates to adminService.initiatePasswordReset', async () => {
      mockAdminService.initiatePasswordReset.mockResolvedValue({
        message: 'Password reset email has been sent to the user',
      });
      const result = await controller.resetPassword('uuid-1');
      expect(result).toEqual({
        message: 'Password reset email has been sent to the user',
      });
    });
  });
});
