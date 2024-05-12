import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './entities/student.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../group/entities/group.entity';
import { GroupService } from '../group/group.service';
import { Staff } from '../staff/entities/staff.entity';
import { StaffService } from '../staff/staff.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Group, Staff])],
  controllers: [StudentController],
  providers: [StudentService, GroupService, StaffService],
})
export class StudentModule {}
