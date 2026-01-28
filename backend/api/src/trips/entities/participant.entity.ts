import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { Trip } from './trip.entity.js';
import { User } from '../../users/entities/user.entity.js';

export enum ParticipantRole {
  ORGANIZER = 'organizer',
  PARTICIPANT = 'participant',
}

@Entity('participants')
@Unique(['user', 'trip'])
@Index(['tripId', 'userId']) // Composite index for faster lookups (Item #26)
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ParticipantRole,
    default: ParticipantRole.PARTICIPANT,
  })
  role: ParticipantRole;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Trip, (trip) => trip.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ name: 'trip_id' })
  tripId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  joinedAt: Date;
}
