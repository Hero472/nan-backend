
import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async createSubject(createSubjectDto: CreateSubjectDto) {
    const subject = this.subjectRepository.create(createSubjectDto);
    return this.subjectRepository.save(subject);
  }

  async createSchedule(createScheduleDto: CreateScheduleDto) {
    const subject = await this.subjectRepository.findOne(createScheduleDto.subjectId);
    if (!subject) {
      throw new Error('Subject not found');
    }
    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
      subject,
    });
    return this.scheduleRepository.save(schedule);
  }

  findAllSubjects() {
    return this.subjectRepository.find({ relations: ['schedules'] });
  }

  findOneSubject(id: number) {
    return this.subjectRepository.findOne(id, { relations: ['schedules'] });
  }
}
