import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service.js';
import { RedisRepository } from '../redis/redis.repository.js';
import { MailerService } from '../mailer/mailer.service.js';
import { TripsService } from '../trips/trips.service.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly appUrl: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly redisRepository: RedisRepository,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly tripsService: TripsService,
  ) {
    this.appUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:3000';
  }

  async getAllUsers(page: number = 1, limit: number = 20) {
    return this.usersService.findAllPaginated(page, limit);
  }

  async getAllTrips(page: number = 1, limit: number = 20) {
    return this.tripsService.findAllPaginated(page, limit);
  }

  async banUser(userId: string): Promise<{ message: string }> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      throw new BadRequestException('User is already banned');
    }

    await this.usersService.setUserActiveStatus(userId, false);
    await this.redisRepository.removeRefreshToken(userId);
    await this.mailerService.sendAccountBannedEmail(user.email, user.nickname);

    this.logger.log(`User banned: ${user.email} (${userId})`);

    return { message: 'User has been banned successfully' };
  }

  async unbanUser(userId: string): Promise<{ message: string }> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isActive) {
      throw new BadRequestException('User is not banned');
    }

    await this.usersService.setUserActiveStatus(userId, true);

    this.logger.log(`User unbanned: ${user.email} (${userId})`);

    return { message: 'User has been unbanned successfully' };
  }

  async initiatePasswordReset(userId: string): Promise<{ message: string }> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    await this.usersService.setPasswordResetToken(userId, resetToken, expires);

    const resetUrl = `${this.appUrl}/reset-password?token=${resetToken}`;
    await this.mailerService.sendPasswordResetEmail({
      email: user.email,
      nickname: user.nickname,
      resetToken,
      resetUrl,
    });

    this.logger.log(`Admin-initiated password reset for user: ${user.email}`);

    return { message: 'Password reset email has been sent to the user' };
  }

  async getUserById(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
