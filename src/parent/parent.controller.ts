import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ParentService } from './parent.service';
import { CreateParentDto } from './dto/create-parent.dto';

@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post()
  create(@Body() createParentDto: CreateParentDto) {
    return this.parentService.create(createParentDto);
  }

  @Get()
  findAll() {
    return this.parentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentService.findOne(+id);
  }

  @Patch('initial-password-recovery:email')
  initialPasswordRecovery(@Param('email') email: string) {
    return this.parentService.initiatePasswordRecovery(email);
  }

  @Patch('verify-password-recovery/:email')
  verifyPasswordRecovery(
    @Param('email') email: string,
    @Body('code') code: string,
  ) {
    return this.parentService.verifyRecoveryCode(email, code);
  }

  @Patch('reset-password-recovery/:email')
  resetPassword(
    @Param('email') email: string,
    @Body('code') code: string,
    @Body('newPassword') newPassword: string
  ) {
    return this.parentService.resetPassword(email, code, newPassword);
  }
}
