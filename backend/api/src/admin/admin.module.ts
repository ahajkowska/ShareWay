import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { UsersModule } from '../users/users.module.js';
import { RedisModule } from '../redis/redis.module.js';
import { MailerModuleLocal } from '../mailer/mailer.module.js';

@Module({
  imports: [UsersModule, RedisModule.register(), MailerModuleLocal],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
