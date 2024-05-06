import { Group } from 'src/modules/group/entities/group.entity';
import { StudentStatus } from 'src/shared/types/enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  group_id: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  tg_username?: string;

  @Column({ default: 0 })
  balance: number;

  @Column()
  status: StudentStatus;

  @Column()
  comment?: string;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Group, (group) => group.students)
  @JoinColumn({ name: 'group_id' })
  group: Group;
}
