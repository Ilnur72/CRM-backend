import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffService } from '../staff/staff.service';
import { Staff } from '../staff/entities/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Staff])],
  controllers: [GroupController],
  providers: [GroupService, StaffService],
})
export class GroupModule {}
