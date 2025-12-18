import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanningController } from './planning.controller.js';
import { PlanningService } from './planning.service.js';
import { Day, Activity } from './entities/index.js';
import { Trip } from '../trips/entities/trip.entity.js';
import { Participant } from '../trips/entities/participant.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Day, Activity, Trip, Participant])],
  controllers: [PlanningController],
  providers: [PlanningService],
  exports: [PlanningService],
})
export class PlanningModule {}
