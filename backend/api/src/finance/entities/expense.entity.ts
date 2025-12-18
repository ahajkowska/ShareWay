import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Trip } from '../../trips/entities/trip.entity.js';
import { ExpenseDebtor } from './expense-debtor.entity.js';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'trip_id' })
  tripId: string;

  @Column({ name: 'payer_id' })
  payerId: string;

  @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payer_id' })
  payer: User;

  @Column({ type: 'integer', comment: 'Amount in lowest currency unit (e.g. cents)' })
  amount: number;

  @Column({ length: 3 })
  currency: string;

  @Column()
  title: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ExpenseDebtor, (debtor) => debtor.expense, { cascade: true })
  debtors: ExpenseDebtor[];
}
