import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParentModule } from './parent/parent.module';
import { StudentModule } from './student/student.module';
import { ProfessorModule } from './professor/professor.module';
import { SubjectModule } from './subject/subject.module';
import { GradeModule } from './grade/grade.module';
import { MedicalInfoModule } from './medical_info/medical_info.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [ParentModule, StudentModule, ProfessorModule, SubjectModule, GradeModule, MedicalInfoModule, AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
