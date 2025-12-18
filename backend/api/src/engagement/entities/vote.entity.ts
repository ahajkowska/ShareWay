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
