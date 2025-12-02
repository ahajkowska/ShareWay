import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './validation/env-validation';
import path from 'path';

const env = process.env.NODE_ENV ?? 'development';

const isTsRun = path.extname(__filename) === '.ts';

const envFilePath = isTsRun
  ? [path.join(__dirname, '..', '..', `.env.${env}`)]
  : [path.join(__dirname, '..', '..', '..', `.env.${env}`)];

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate, envFilePath })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
