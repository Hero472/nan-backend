
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.createSubject(createSubjectDto);
  }

  @Post('schedule')
  createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.subjectService.createSchedule(createScheduleDto);
  }

  @Get()
  findAll() {
    return this.subjectService.findAllSubjects();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectService.findOneSubject(+id);
  }
}
