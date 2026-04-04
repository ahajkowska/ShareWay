import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

const makeContext = (
  handler: object = {},
  cls: object = {},
): ExecutionContext =>
  ({
    getHandler: () => handler,
    getClass: () => cls,
    switchToHttp: () => ({ getRequest: () => ({}) }),
  }) as unknown as ExecutionContext;

describe('JwtAuthGuard', () => {
  let reflector: Reflector;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
  });

  it('returns true for public routes without calling passport', () => {
    const handler = {};
    Reflect.defineMetadata(IS_PUBLIC_KEY, true, handler);

    const ctx = makeContext(handler);
    const result = guard.canActivate(ctx);
    expect(result).toBe(true);
  });

  it('delegates to passport super.canActivate for non-public routes', () => {
    const ctx = makeContext();
    const superSpy = jest
      .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
      .mockReturnValue(true);

    guard.canActivate(ctx);
    expect(superSpy).toHaveBeenCalledWith(ctx);
    superSpy.mockRestore();
  });
});
