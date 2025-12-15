import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service.js';
import path from 'path';

const isTsRun = path.extname(__filename) === '.ts';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const env = process.env.NODE_ENV ?? 'development';
        const isDev = env === 'development';

        const mailHost = configService.get<string>('MAIL_HOST');
        const mailPort = configService.get<number>('MAIL_PORT');
        const mailUser = configService.get<string>('MAIL_USER');
        const mailPassword = configService.get<string>('MAIL_PASSWORD');
        const mailFrom =
          configService.get<string>('MAIL_FROM') ||
          '"ShareWay" <noreply@shareway.app>';

        const templateDir = isTsRun
          ? path.join(__dirname, 'templates')
          : path.join(__dirname, '..', 'mailer', 'templates');

        return {
          transport: {
            host: mailHost || 'localhost',
            port: mailPort || 1025,
            secure: !isDev && configService.get<boolean>('MAIL_SECURE', false),
            auth:
              mailUser && mailPassword
                ? {
                    user: mailUser,
                    pass: mailPassword,
                  }
                : undefined,
            ...(isDev && { ignoreTLS: true }),
          },
          defaults: {
            from: mailFrom,
          },
          template: {
            dir: templateDir,
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
          preview: isDev,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModuleLocal {}
