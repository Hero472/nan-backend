import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GradeService } from './grade.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Controller('grade')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Post()
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradeService.create(createGradeDto);
  }

  @Get()
  findAll() {
    return this.gradeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradeService.findOne(+id);
  }

  @Get('get-student-grades/:id')
  getStudentGrades(@Param('id') id: string) {
    return this.gradeService.getStudentGrades(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradeService.update(+id, updateGradeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradeService.remove(+id);
  }
}
