import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { RedisRepository } from '../../redis/redis.repository.js';

export interface RefreshTokenPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisRepository: RedisRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: RefreshTokenPayload) {
    const refreshToken = request?.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      await this.redisRepository.validateRefreshToken(
        payload.sub,
        refreshToken,
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    return {
      userId: payload.sub,
      refreshToken,
    };
  }
}
