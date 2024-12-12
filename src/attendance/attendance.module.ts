import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from './entities/attendance.entity';
import { SubjectModule } from '../subject/subject.module';
import { NotificationService } from 'src/notifications/notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Attendance', schema: AttendanceSchema }]),
    SubjectModule
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, NotificationService],
  exports: [AttendanceService]
})
export class AttendanceModule {}
