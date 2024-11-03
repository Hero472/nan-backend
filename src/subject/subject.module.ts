import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from 'src/professor/entities/professor.entity';
import { Subject } from './entities/subject.entity';
import { Student } from 'src/student/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Professor, Student]),
],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService]
})
export class SubjectModule {}
