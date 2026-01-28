import { Injectable, Logger } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export interface WelcomeEmailData {
  email: string;
  nickname: string;
}

export interface ResetPasswordEmailData {
  email: string;
  nickname: string;
  resetToken: string;
  resetUrl: string;
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly appUrl: string;

  constructor(
    private readonly mailerService: NestMailerService,
    private readonly configService: ConfigService,
  ) {
    this.appUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:3000';
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Welcome to ShareWay!',
        template: 'welcome',
        context: {
          nickname: data.nickname,
          email: data.email,
          appUrl: this.appUrl,
          loginUrl: `${this.appUrl}/login`,
        },
      });
      this.logger.log(`Welcome email sent to ${data.email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${data.email}`, error);
    }
  }

  async sendPasswordResetEmail(data: ResetPasswordEmailData): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: data.email,
        subject: 'Reset Your ShareWay Password',
        template: 'reset-password',
        context: {
          nickname: data.nickname,
          resetUrl: data.resetUrl,
          resetToken: data.resetToken,
          appUrl: this.appUrl,
          expiresIn: '1 hour',
        },
      });
      this.logger.log(`Password reset email sent to ${data.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${data.email}`,
        error,
      );
      throw error;
    }
  }

  async sendAccountBannedEmail(
    email: string,
    nickname: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your ShareWay Account Has Been Suspended',
        template: 'account-banned',
        context: {
          nickname,
          appUrl: this.appUrl,
          supportEmail: 'support@shareway.app',
        },
      });
      this.logger.log(`Account banned email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send account banned email to ${email}`,
        error,
      );
    }
  }
}
