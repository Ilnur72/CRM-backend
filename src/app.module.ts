import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './shared/core/core.modules';
import { StudentModule } from './modules/student/student.module';
import { GroupModule } from './modules/group/group.module';
import { DirectionModule } from './modules/direction/direction.module';
import { StaffModule } from './modules/staff/staff.module';

@Module({
  imports: [
    CoreModule,
    StudentModule,
    GroupModule,
    DirectionModule,
    StaffModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
