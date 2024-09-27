import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';

@Controller('professor')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Post()
  create(@Body() createProfessorDto: CreateProfessorDto) {
    return this.professorService.create(createProfessorDto);
  }

  @Get()
  findAll() {
    return this.professorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professorService.findOne(+id);
  }

  @Patch('initial-password-recovery:email')
  initialPasswordRecovery(@Param('email') email: string) {
    return this.professorService.initiatePasswordRecovery(email);
  }

  @Patch('verify-password-recovery/:email')
  verifyPasswordRecovery(
    @Param('email') email: string,
    @Body('code') code: string,
  ) {
    return this.professorService.verifyRecoveryCode(email, code);
  }

  @Patch('reset-password-recovery/:email')
  resetPassword(
    @Param('email') email: string,
    @Body('code') code: string,
    @Body('newPassword') newPassword: string
  ) {
    return this.professorService.resetPassword(email, code, newPassword);
  }
}
