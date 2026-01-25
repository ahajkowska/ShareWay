import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsController } from './trips.controller.js';
import { TripsService } from './trips.service.js';
import { Trip, Participant } from './entities/index.js';
import { User } from '../users/entities/user.entity.js';
import { TripAccessGuard } from './guards/trip-access.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Participant, User])],
  controllers: [TripsController],
  providers: [TripsService, TripAccessGuard],
  exports: [
    TripsService,
    TripAccessGuard,
    TypeOrmModule.forFeature([Participant]),
  ],
})
export class TripsModule {}
