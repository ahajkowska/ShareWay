import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response, Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto, LoginDto } from '../users/dto/index.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { Public } from './decorators/public.decorator.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import {
  COOKIE_OPTIONS,
  COOKIE_NAMES,
  TOKEN_EXPIRY,
} from './constants/auth.constants.js';
import type {
  AuthenticatedUser,
  RefreshTokenUser,
} from './interfaces/auth.interfaces.js';

interface RequestWithUser extends ExpressRequest {
  user?: AuthenticatedUser;
}

interface RequestWithRefreshUser extends ExpressRequest {
  user?: RefreshTokenUser;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const tokens = await this.authService.login(loginDto);

    response.cookie(COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: TOKEN_EXPIRY.ACCESS_TOKEN_MS,
    });

    response.cookie(COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: TOKEN_EXPIRY.REFRESH_TOKEN_MS,
    });

    return { message: 'Login successful' };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = req.user?.userId;

    if (userId) {
      await this.authService.logout(userId);
    }

    response.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, COOKIE_OPTIONS);
    response.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, COOKIE_OPTIONS);

    return { message: 'Logout successful' };
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: RequestWithRefreshUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = req.user;
    if (!user) {
      throw new Error('User not found');
    }
    const tokens = await this.authService.refresh(
      user.userId,
      user.refreshToken,
    );

    response.cookie(COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: TOKEN_EXPIRY.ACCESS_TOKEN_MS,
    });

    response.cookie(COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: TOKEN_EXPIRY.REFRESH_TOKEN_MS,
    });

    return { message: 'Tokens refreshed successfully' };
  }
}
