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
import { PlanningModule } from './planning/planning.module.js';
import { User } from './users/entities/user.entity.js';
import { Trip, Participant } from './trips/entities/index.js';
import { Day, Activity } from './planning/entities/index.js';
import { FinanceModule } from './finance/finance.module.js';
import { Expense, ExpenseDebtor } from './finance/entities/index.js';
import { EngagementModule } from './engagement/engagement.module.js';
import {
  Vote,
  VoteOption,
  VoteCast,
  ChecklistItem,
  ChecklistItemState,
} from './engagement/entities/index.js';
import path from 'path';

const env = process.env.NODE_ENV ?? 'development';

const isTsRun = path.extname(__filename) === '.ts';

// Load .env files with priority: .env.local > .env.{env} > .env
// Note: dotenv loads variables from FIRST file that defines them (first match wins)
const envFilePath = isTsRun
  ? [
      path.join(__dirname, '..', '.env.local'),
      path.join(__dirname, '..', '..', `.env.${env}`),
      path.join(__dirname, '..', '..', '.env'),
    ]
  : [
      path.join(__dirname, '..', '.env.local'),
      path.join(__dirname, '..', '..', '..', `.env.${env}`),
      path.join(__dirname, '..', '..', '..', '.env'),
    ];

console.log('🔍 Environment loading debug:');
console.log('  NODE_ENV:', env);
console.log('  isTsRun:', isTsRun);
console.log('  __filename:', __filename);
console.log('  __dirname:', __dirname);
console.log('  envFilePath:', envFilePath);
envFilePath.forEach((p) => {
  const fs = require('fs');
  console.log(`  - ${p} ${fs.existsSync(p) ? '✓ exists' : '✗ not found'}`);
});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate, envFilePath }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log('📊 Database config values:');
        console.log('  DATABASE_HOST:', configService.getOrThrow<string>('DATABASE_HOST'));
        console.log('  DATABASE_PORT:', configService.getOrThrow<number>('DATABASE_PORT'));
        console.log('  REDIS_HOST:', configService.get<string>('REDIS_HOST'));
        console.log('  REDIS_PORT:', configService.get<number>('REDIS_PORT'));
        return {
          type: 'postgres',
          host: configService.getOrThrow<string>('DATABASE_HOST'),
          port: configService.getOrThrow<number>('DATABASE_PORT'),
          username: configService.getOrThrow<string>('DATABASE_USER'),
          password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
          database: configService.getOrThrow<string>('DATABASE_NAME'),
          entities: [
            User,
          Trip,
          Participant,
          Day,
          Activity,
          Expense,
          ExpenseDebtor,
          Vote,
          VoteOption,
          VoteCast,
          ChecklistItem,
          ChecklistItemState,
        ],
        synchronize: env === 'development',
        logging: env === 'development',
      };
    },
      inject: [ConfigService],
    }),
    MailerModuleLocal,
    AuthModule,
    UsersModule,
    AdminModule,
    TripsModule,
    PlanningModule,
    FinanceModule,
    EngagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
