import { Group } from 'src/modules/group/entities/group.entity';
import { StaffRole } from 'src/shared/types/enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  tg_username?: string;

  @Column()
  role: StaffRole;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Group, (group) => group.students)
  @JoinColumn({ name: 'group_id' })
  group: Group;
}
