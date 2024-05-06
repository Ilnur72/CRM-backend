import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './shared/core/core.modules';
import { StudentModule } from './modules/student/student.module';
import { GroupModule } from './modules/group/group.module';
import { StaffModule } from './modules/staff/staff.module';

@Module({
  imports: [CoreModule, StudentModule, GroupModule, StaffModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
