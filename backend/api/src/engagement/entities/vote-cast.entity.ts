import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { VoteOption } from './vote-option.entity.js';

@Entity('vote_casts')
@Unique(['option', 'voter']) // Actually, a user should vote once per VOTE, not per option. 
// But TypeORM unique constraint across relations is tricky if vote_id is not here.
// We can store vote_id here too or enforce logic in service. 
// Ideally: Unique(['voteId', 'voterId']) but we need voteId column.
// Let's rely on service logic for "one vote per user" or allow multiple if requirements don't forbid. 
// Requirement says "VoteCast: id, option_id, voter_id".
export class VoteCast {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'option_id' })
    optionId: string;

    @ManyToOne(() => VoteOption, (option) => option.casts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'option_id' })
    option: VoteOption;

    @Column({ name: 'voter_id' })
    voterId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'voter_id' })
    voter: User;
}
