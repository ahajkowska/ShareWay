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
@Unique(['option', 'voter'])
export class VoteCast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'option_id' })
  optionId: string;

  @ManyToOne(() => VoteOption, (option) => option.casts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'option_id' })
  option: VoteOption;

  @Column({ name: 'voter_id' })
  voterId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'voter_id' })
  voter: User;
}
