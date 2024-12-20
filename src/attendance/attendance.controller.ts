import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Get('student/:id')
  async getAttendanceStudent(@Param('id') id: number): Promise<Attendance[]> {
    return this.attendanceService.getAttendanceStudent(id);
  }

  @Get('subject/:id_subject/percentage')
  async getAttendancePercentageForSubject(
    @Param('id_subject') id_subject: number,
  ): Promise<number> {
    return this.attendanceService.getAttendancePercentageForSubject(id_subject);
  }

  @Get('subject/:id_subject/student/:id_student/percentage')
  async getAttendanceForStudentInSubject(
    @Param('id_subject') id_subject: number,
    @Param('id_student') id_student: number,
  ): Promise<number> {
    return this.attendanceService.getAttendanceForStudentInSubject(id_subject, id_student);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
