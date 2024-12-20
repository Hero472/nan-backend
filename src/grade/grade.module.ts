import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';
import { Student } from '../student/entities/student.entity';
import { Subject } from '../subject/entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grade, Student, Subject])],
  controllers: [GradeController],
  providers: [GradeService],
  exports: [GradeService]
})
export class GradeModule {}
