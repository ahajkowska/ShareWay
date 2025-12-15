import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service.js';
import { RedisRepository } from '../redis/redis.repository.js';
import { MailerService } from '../mailer/mailer.service.js';
import { RegisterDto, LoginDto } from '../users/dto/index.js';
import {
  TokenPair,
  JwtPayload,
  RefreshTokenPayload,
} from './interfaces/auth.interfaces.js';
import { TOKEN_EXPIRY } from './constants/auth.constants.js';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisRepository: RedisRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly mailerService: MailerService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const existingUser = await this.usersService.emailExists(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const user = await this.usersService.create(registerDto);

    this.eventEmitter.emit('user.registered', {
      userId: user.id,
      email: user.email,
      nickname: user.nickname,
    });

    await this.mailerService.sendWelcomeEmail({
      email: user.email,
      nickname: user.nickname,
    });

    this.logger.log(`User registered: ${user.email}`);

    return { message: 'Registration successful' };
  }

  async login(loginDto: LoginDto): Promise<TokenPair> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    await this.redisRepository.storeRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`User logged in: ${user.email}`);

    return tokens;
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.redisRepository.removeRefreshToken(userId);
    this.logger.log(`User logged out: ${userId}`);
    return { message: 'Logout successful' };
  }

  async refresh(userId: string, oldRefreshToken: string): Promise<TokenPair> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    const newTokens = await this.generateTokens(user.id, user.email);

    await this.redisRepository.rotateRefreshToken(
      userId,
      oldRefreshToken,
      newTokens.refreshToken,
    );

    this.logger.log(`Tokens refreshed for user: ${user.email}`);

    return newTokens;
  }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<TokenPair> {
    const jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
    const jwtRefreshSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    const accessPayload: JwtPayload = {
      sub: userId,
      email,
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: userId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: jwtSecret,
        expiresIn: TOKEN_EXPIRY.ACCESS_TOKEN_EXPIRY,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: jwtRefreshSecret,
        expiresIn: TOKEN_EXPIRY.REFRESH_TOKEN_EXPIRY,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
