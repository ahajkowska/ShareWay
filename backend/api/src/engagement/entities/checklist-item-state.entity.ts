import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { ChecklistItem } from './checklist-item.entity.js';

@Entity('checklist_item_states')
@Unique(['item', 'user'])
export class ChecklistItemState {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'item_id' })
    itemId: string;

    @ManyToOne(() => ChecklistItem, (item) => item.states, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'item_id' })
    item: ChecklistItem;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ default: false, name: 'is_checked' })
    isChecked: boolean;
}
