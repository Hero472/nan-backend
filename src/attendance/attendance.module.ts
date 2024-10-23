import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from './entities/attendance.entity';
import { SubjectModule } from '../subject/subject.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Attendance', schema: AttendanceSchema }]),
    SubjectModule
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService]
})
export class AttendanceModule {}
