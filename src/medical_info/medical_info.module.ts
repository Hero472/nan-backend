import { Module } from '@nestjs/common';
import { MedicalInfoService } from './medical_info.service';
import { MedicalInfoController } from './medical_info.controller';

@Module({
  controllers: [MedicalInfoController],
  providers: [MedicalInfoService],
})
export class MedicalInfoModule {}
