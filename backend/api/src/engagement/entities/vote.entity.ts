import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity.js';
import { VoteOption } from './vote-option.entity.js';
import { User } from '../../users/entities/user.entity.js';

export enum VoteStatus {
    OPEN = 'open',
    CLOSED = 'closed',
}

@Entity('votes')
export class Vote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'trip_id' })
    tripId: string;

    @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'trip_id' })
    trip: Trip;

    @Column()
    question: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    title: string | null;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'timestamptz', nullable: true, name: 'ends_at' })
    endsAt: Date | null;

    @Column({ type: 'uuid', nullable: true, name: 'created_by' })
    createdBy: string | null;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'created_by' })
    creator: User;

    @Column({
        type: 'enum',
        enum: VoteStatus,
        default: VoteStatus.OPEN,
    })
    status: VoteStatus;

    @OneToMany(() => VoteOption, (option) => option.vote, { cascade: true })
    options: VoteOption[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
