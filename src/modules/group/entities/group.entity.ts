import { Direction } from 'src/modules/direction/entities/course.entity';
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

  @Column({ generated: 'increment' })
  group_id: number;

  @Column()
  title: string;

  @Column()
  direction_id: string;

  @Column()
  description: string;

  @Column()
  status: GroupStatus;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Direction, (direction) => direction.groups)
  @JoinColumn({ name: 'direction_id' })
  direction: Direction;

  @OneToMany(() => Student, (student) => student.group)
  students: Student[];
}
