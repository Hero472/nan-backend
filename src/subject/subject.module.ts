import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from 'src/professor/entities/professor.entity';
import { Subject } from './entities/subject.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Professor]), JwtModule],
  controllers: [SubjectController],
  providers: [SubjectService],
  exports: [SubjectService]
})
export class SubjectModule {}
