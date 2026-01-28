import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity.js';
import { ChecklistItemState } from './checklist-item-state.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('checklist_items')
export class ChecklistItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'trip_id' })
  tripId: string;

  @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column()
  text: string;

  @Column({ name: 'creator_id', nullable: true })
  creatorId: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creator_id' })
  creator: User | null;

  @OneToMany(() => ChecklistItemState, (state) => state.item)
  states: ChecklistItemState[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
