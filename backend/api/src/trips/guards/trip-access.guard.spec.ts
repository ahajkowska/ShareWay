import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { TripAccessGuard, ORGANIZER_ONLY_KEY } from './trip-access.guard';
import { ParticipantRole } from '../entities/participant.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Participant } from '../entities/participant.entity';
import { Test } from '@nestjs/testing';

const makeContext = (user: any, params: any = {}): ExecutionContext => {
  const request: any = { user, params };
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
};

const makeContextWithHandler = (
  user: any,
  params: any,
  handler: object,
): ExecutionContext => {
  const request: any = { user, params };
  return {
    getHandler: () => handler,
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
};

const mockParticipantRepo = {
  findOne: jest.fn(),
};

describe('TripAccessGuard', () => {
  let guard: TripAccessGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    jest.resetAllMocks();
    reflector = new Reflector();

    const module = await Test.createTestingModule({
      providers: [
        TripAccessGuard,
        {
          provide: getRepositoryToken(Participant),
          useValue: mockParticipantRepo,
        },
        { provide: Reflector, useValue: reflector },
      ],
    }).compile();

    guard = module.get<TripAccessGuard>(TripAccessGuard);
  });

  it('throws ForbiddenException when userId is not present', async () => {
    const ctx = makeContext(null, { id: 'trip-1' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('returns true when no tripId in params', async () => {
    const ctx = makeContext({ userId: 'user-1' }, {});
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
  });

  it('throws ForbiddenException when user is not a participant', async () => {
    mockParticipantRepo.findOne.mockResolvedValue(null);
    const ctx = makeContext({ userId: 'user-1' }, { id: 'trip-1' });
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('returns true for participant on non-organizer-only route', async () => {
    mockParticipantRepo.findOne.mockResolvedValue({
      userId: 'user-1',
      tripId: 'trip-1',
      role: ParticipantRole.PARTICIPANT,
    });
    const ctx = makeContext({ userId: 'user-1' }, { id: 'trip-1' });
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
  });

  it('throws ForbiddenException when organizer-only but user is participant', async () => {
    mockParticipantRepo.findOne.mockResolvedValue({
      userId: 'user-1',
      tripId: 'trip-1',
      role: ParticipantRole.PARTICIPANT,
    });
    const handler = {};
    Reflect.defineMetadata(ORGANIZER_ONLY_KEY, true, handler);
    const ctx = makeContextWithHandler(
      { userId: 'user-1' },
      { id: 'trip-1' },
      handler,
    );
    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('returns true when organizer-only and user is organizer', async () => {
    const participant = {
      userId: 'user-1',
      tripId: 'trip-1',
      role: ParticipantRole.ORGANIZER,
    };
    mockParticipantRepo.findOne.mockResolvedValue(participant);
    const handler = {};
    Reflect.defineMetadata(ORGANIZER_ONLY_KEY, true, handler);
    const ctx = makeContextWithHandler(
      { userId: 'user-1' },
      { id: 'trip-1' },
      handler,
    );
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
  });

  it('uses tripId param when id is not present', async () => {
    mockParticipantRepo.findOne.mockResolvedValue({
      userId: 'user-1',
      tripId: 'trip-1',
      role: ParticipantRole.PARTICIPANT,
    });
    const ctx = makeContext({ userId: 'user-1' }, { tripId: 'trip-1' });
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
  });
});
