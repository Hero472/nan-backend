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
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Subject } from 'rxjs';
import { Professor } from './professor/entities/professor.entity';
import { Student } from './student/entities/student.entity';
import { Parent } from './parent/entities/parent.entity';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ParentModule,
    StudentModule,
    ProfessorModule,
    SubjectModule,
    GradeModule,
    MedicalInfoModule,
    AttendanceModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('TYPEORM_HOST'),
        port: configService.get<number>('TYPEORM_PORT'),
        password: configService.get<string>('TYPEORM_PASSWORD'),
        username: configService.get<string>('TYPEORM_USERNAME'),
        entities: [Professor, Student, Subject, Parent],
        database: configService.get<string>('TYPEORM_DATABASE'),
        synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE'),
        logging: configService.get<boolean>('TYPEORM_LOGGING'),
        ssl: false,
      }),
    }),
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
