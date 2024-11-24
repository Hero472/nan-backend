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
import { Professor } from './professor/entities/professor.entity';
import { Student } from './student/entities/student.entity';
import { Parent } from './parent/entities/parent.entity';
import { MailModule } from './mail/mail.module';
import baseConfig from './config/env/base-config';
import configValidation from './config/env/config-validation';
import { ProfessorController } from './professor/professor.controller';
import { StudentController } from './student/student.controller';
import { SubjectController } from './subject/subject.controller';
import { ParentController } from './parent/parent.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceController } from './attendance/attendance.controller';
import { Subject } from './subject/entities/subject.entity';
import { GradeController } from './grade/grade.controller';
import { Grade } from './grade/entities/grade.entity';
import { TransbankModule } from './transbank/transbank.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AuthModule,
    ParentModule,
    StudentModule,
    ProfessorModule,
    SubjectModule,
    GradeModule,
    MedicalInfoModule,
    AttendanceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [baseConfig],
      validationSchema: configValidation,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('TYPEORM_HOST') || 'localhost';
        const port = configService.get<number>('TYPEORM_PORT') || 5432;
        const password = configService.get<string>('TYPEORM_PASSWORD') || '123456789';
        const username =  configService.get<string>('TYPEORM_USERNAME') || 'postgres';
        const database = configService.get<string>('TYPEORM_DATABASE') || 'postgres';
        const synchronize = configService.get<boolean>('TYPEORM_SYNCHRONIZE') || true;
        const logging = configService.get<boolean>('TYPEORM_LOGGING') || true;

        console.log('Database host:', host);
        console.log('Database port:', port);
        console.log('Database username:', username);
        console.log('Database password:', password ? '***hidden***' : 'No password provided');
        console.log('Database name:', database);
        console.log('Synchronize:', synchronize);
        console.log('Logging:', logging);

        return {
          type: 'postgres',
          host,
          port,
          password,
          username,
          database,
          entities: [Professor, Student, Subject, Parent, Grade],
          synchronize,
          logging,
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
    }),
    MailModule,
    AuthModule,
    TransbankModule,
    ChatModule
  ],
  controllers: [AttendanceController, AppController, ProfessorController, StudentController, SubjectController, ParentController, AuthController, GradeController],
  providers: [AppService],
})
export class AppModule {}
