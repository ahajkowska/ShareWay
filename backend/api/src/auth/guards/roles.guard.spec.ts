import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../../users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

const makeContext = (user: any, handler: object = {}, cls: object = {}): ExecutionContext => {
  const request: any = { user };
  return {
    getHandler: () => handler,
    getClass: () => cls,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
};

const makeUser = (overrides = {}) => ({
  id: 'uuid-1',
  role: UserRole.USER,
  isActive: true,
  ...overrides,
});

describe('RolesGuard', () => {
  let reflector: Reflector;
  let usersService: any;
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = new Reflector();
    usersService = { findById: jest.fn() };
    guard = new RolesGuard(reflector, usersService);
  });

  it('returns true when no roles are required', async () => {
    // no metadata set → requiredRoles is undefined
    const ctx = makeContext({ userId: 'uuid-1' });
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
  });

  it('throws ForbiddenException when userId is missing', async () => {
    const handler = {};
    Reflect.defineMetadata(ROLES_KEY, [UserRole.ADMIN], handler);
    const ctx = makeContext(null, handler);
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when user not found in DB', async () => {
    const handler = {};
    Reflect.defineMetadata(ROLES_KEY, [UserRole.ADMIN], handler);
    const ctx = makeContext({ userId: 'uuid-1' }, handler);
    usersService.findById.mockResolvedValue(null);
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when user is inactive', async () => {
    const handler = {};
    Reflect.defineMetadata(ROLES_KEY, [UserRole.ADMIN], handler);
    const ctx = makeContext({ userId: 'uuid-1' }, handler);
    usersService.findById.mockResolvedValue(makeUser({ isActive: false }));
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when user has wrong role', async () => {
    const handler = {};
    Reflect.defineMetadata(ROLES_KEY, [UserRole.ADMIN], handler);
    const ctx = makeContext({ userId: 'uuid-1' }, handler);
    usersService.findById.mockResolvedValue(makeUser({ role: UserRole.USER }));
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('returns true and sets userEntity when user has required role', async () => {
    const handler = {};
    Reflect.defineMetadata(ROLES_KEY, [UserRole.ADMIN], handler);
    const request: any = { user: { userId: 'uuid-1' } };
    const ctx = {
      getHandler: () => handler,
      getClass: () => ({}),
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
    const admin = makeUser({ role: UserRole.ADMIN });
    usersService.findById.mockResolvedValue(admin);

    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect(request.userEntity).toBe(admin);
  });
});
