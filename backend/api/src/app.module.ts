import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { validate } from './validation/env-validation.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { AdminModule } from './admin/admin.module.js';
import { MailerModuleLocal } from './mailer/mailer.module.js';
import { TripsModule } from './trips/trips.module.js';
import { User } from './users/entities/user.entity.js';
import { Trip, Participant } from './trips/entities/index.js';
import { FinanceModule } from './finance/finance.module.js';
import { Expense, ExpenseDebtor } from './finance/entities/index.js';
import { EngagementModule } from './engagement/engagement.module.js';
import { Vote, VoteOption, VoteCast, ChecklistItem, ChecklistItemState } from './engagement/entities/index.js';
import path from 'path';

const env = process.env.NODE_ENV ?? 'development';

const isTsRun = path.extname(__filename) === '.ts';

const envFilePath = isTsRun
  ? [path.join(__dirname, '..', '..', `.env.${env}`)]
  : [path.join(__dirname, '..', '..', '..', `.env.${env}`)];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate, envFilePath }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('DATABASE_HOST'),
        port: configService.getOrThrow<number>('DATABASE_PORT'),
        username: configService.getOrThrow<string>('DATABASE_USER'),
        password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: configService.getOrThrow<string>('DATABASE_NAME'),
        entities: [User, Trip, Participant, Expense, ExpenseDebtor, Vote, VoteOption, VoteCast, ChecklistItem, ChecklistItemState],
        synchronize: env === 'development',
        logging: env === 'development',
      }),
      inject: [ConfigService],
    }),
    MailerModuleLocal,
    AuthModule,
    UsersModule,
    AdminModule,
    TripsModule,
    FinanceModule,
    EngagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
