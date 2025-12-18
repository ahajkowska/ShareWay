import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Expense } from './expense.entity.js';

@Entity('expense_debtors')
export class ExpenseDebtor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'expense_id' })
    expenseId: string;

    @Column({ name: 'debtor_id' })
    debtorId: string;

    @ManyToOne(() => Expense, (expense) => expense.debtors, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'expense_id' })
    expense: Expense;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'debtor_id' })
    debtor: User;
}
