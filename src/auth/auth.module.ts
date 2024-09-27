import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { Subject } from 'src/subject/entities/subject.entity';
import { Parent } from 'src/parent/entities/parent.entity';
import { ParentService } from 'src/parent/parent.service';
import { SubjectService } from 'src/subject/subject.service';
import { StudentService } from 'src/student/student.service';
import { Professor } from 'src/professor/entities/professor.entity';
import { MailModule } from 'src/mail/mail.module';

dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    TypeOrmModule.forFeature([Professor, Parent, Subject, Student]),
    MailModule,
  ],
  providers: [AuthService, ParentService, SubjectService, StudentService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
