import { Staff } from 'src/modules/staff/entities/staff.entity';
import { Student } from 'src/modules/student/entities/student.entity';
import { GroupStatus } from 'src/shared/types/enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teacher_id: string;

  @Column({ generated: 'increment' })
  group_id: number;

  @Column()
  title: string;

  @Column()
  description?: string;

  @Column()
  duration: string;

  @Column()
  lesson_duration?: string;

  @Column()
  price: number;

  @Column()
  status: GroupStatus;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Staff, (staff) => staff.groups)
  @JoinColumn({ name: 'teacher_id' })
  staff: Staff;

  @OneToMany(() => Student, (student) => student.group)
  students: Student[];
}
