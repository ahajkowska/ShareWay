import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Day } from './day.entity.js';
import { User } from '../../users/entities/user.entity.js';

export enum ActivityType {
  FLIGHT = 'FLIGHT',
  TRANSPORT = 'TRANSPORT',
  ACCOMMODATION = 'ACCOMMODATION',
  FOOD = 'FOOD',
  ATTRACTION = 'ATTRACTION',
  ACTIVITY = 'ACTIVITY',
  MEETING = 'MEETING',
  OTHER = 'OTHER',
}

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ActivityType, default: ActivityType.OTHER })
  type: ActivityType;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'time', nullable: true })
  startTime: string | null;

  @Column({ type: 'time', nullable: true })
  endTime: string | null;

  @Column({ type: 'text', nullable: true })
  location: string | null;

  @Column()
  dayId: string;

  @ManyToOne(() => Day, (day) => day.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dayId' })
  day: Day;

  @Column()
  creatorId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
