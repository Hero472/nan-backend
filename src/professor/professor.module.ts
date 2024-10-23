import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { MailService } from '../mail/mail.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Professor]), JwtModule],
  controllers: [ProfessorController],
  providers: [ProfessorService, MailService],
  exports: [ProfessorService]
})
export class ProfessorModule {}
