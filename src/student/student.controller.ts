import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { LevelEnum } from 'src/enum';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('access_token') access_token: string) {
    return this.studentService.findOne(access_token);
  }

  @Patch('initial-password-recovery:email')
  initialPasswordRecovery(@Param('email') email: string) {
    return this.studentService.initiatePasswordRecovery(email);
  }

  @Patch('verify-password-recovery/:email')
  verifyPasswordRecovery(
    @Param('email') email: string,
    @Body('code') code: string,
  ) {
    return this.studentService.verifyRecoveryCode(email, code);
  }

  @Patch('reset-password-recovery/:email')
  resetPassword(
    @Param('email') email: string,
    @Body('code') code: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.studentService.resetPassword(email, code, newPassword);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { updateStudentDto: UpdateStudentDto; level: LevelEnum },
  ) {
    const { updateStudentDto, level } = body;
    return this.studentService.update(+id, updateStudentDto, level);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(+id);
  }
}
