import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parent } from 'src/parent/entities/parent.entity';
import { Student } from './entities/student.entity';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Parent])],
  controllers: [StudentController],
  providers: [StudentService, MailService],
  exports: [StudentService]
})
export class StudentModule {}
