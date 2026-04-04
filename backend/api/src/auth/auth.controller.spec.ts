import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  refresh: jest.fn(),
};

const mockResponse = () => {
  const res: any = {};
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RefreshTokenGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('register', () => {
    it('delegates to authService.register', async () => {
      mockAuthService.register.mockResolvedValue({
        message: 'Registration successful',
      });
      const dto = { email: 'a@b.com', password: 'pass', nickname: 'A' };
      const result = await controller.register(dto as any);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: 'Registration successful' });
    });
  });

  describe('login', () => {
    it('sets cookies and returns message', async () => {
      mockAuthService.login.mockResolvedValue({
        accessToken: 'at',
        refreshToken: 'rt',
      });
      const res = mockResponse();
      const result = await controller.login(
        { email: 'a@b.com', password: 'pw' } as any,
        res,
      );
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ message: 'Login successful' });
    });
  });

  describe('logout', () => {
    it('clears cookies and delegates to authService.logout', async () => {
      mockAuthService.logout.mockResolvedValue({
        message: 'Logout successful',
      });
      const res = mockResponse();
      const req: any = { user: { userId: 'uuid-1' } };
      const result = await controller.logout(req, res);
      expect(mockAuthService.logout).toHaveBeenCalledWith('uuid-1');
      expect(res.clearCookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ message: 'Logout successful' });
    });

    it('handles missing userId gracefully', async () => {
      const res = mockResponse();
      const req: any = { user: undefined };
      await controller.logout(req, res);
      expect(mockAuthService.logout).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('refreshes tokens and sets cookies', async () => {
      mockAuthService.refresh.mockResolvedValue({
        accessToken: 'new_at',
        refreshToken: 'new_rt',
      });
      const res = mockResponse();
      const req: any = { user: { userId: 'uuid-1', refreshToken: 'old_rt' } };
      const result = await controller.refresh(req, res);
      expect(mockAuthService.refresh).toHaveBeenCalledWith('uuid-1', 'old_rt');
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ message: 'Tokens refreshed successfully' });
    });

    it('throws when user is missing', async () => {
      const req: any = { user: undefined };
      const res = mockResponse();
      await expect(controller.refresh(req, res)).rejects.toThrow();
    });
  });
});
