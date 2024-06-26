import { Group } from 'src/modules/group/entities/group.entity';
import { StaffRole } from 'src/shared/types/enums';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  direction: string;

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

  @OneToMany(() => Group, (group) => group.staff)
  groups: Group[];
}
