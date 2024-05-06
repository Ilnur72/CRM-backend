// import { Group } from 'src/modules/group/entities/group.entity';
// import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
// export class Direction {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ unique: true })
//   title: string;

//   @Column()
//   teacher_name: string;

//   @Column()
//   price: number;

//   @Column()
//   description: string;

//   @Column()
//   duration: string;

//   @Column({ default: false })
//   is_deleted: boolean;

//   @Column({ default: () => 'CURRENT_TIMESTAMP' })
//   created_at: Date;

//   @OneToMany(() => Group, (group) => group.direction)
//   groups: Group[];
// }
