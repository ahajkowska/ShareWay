import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Vote } from './vote.entity.js';
import { VoteCast } from './vote-cast.entity.js';

@Entity('vote_options')
export class VoteOption {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'vote_id' })
    voteId: string;

    @ManyToOne(() => Vote, (vote) => vote.options, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vote_id' })
    vote: Vote;

    @Column()
    text: string;

    @OneToMany(() => VoteCast, (cast) => cast.option)
    casts: VoteCast[];
}
