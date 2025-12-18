import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngagementService } from './engagement.service.js';
import { EngagementController } from './engagement.controller.js';
import { Vote, VoteOption, VoteCast, ChecklistItem, ChecklistItemState } from './entities/index.js';
import { TripsModule } from '../trips/trips.module.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Vote, VoteOption, VoteCast, ChecklistItem, ChecklistItemState]),
        TripsModule,
    ],
    controllers: [EngagementController],
    providers: [EngagementService],
    exports: [EngagementService],
})
export class EngagementModule { }
