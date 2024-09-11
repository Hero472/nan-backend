import { Injectable } from '@nestjs/common';
import { CreateMedicalInfoDto } from './dto/create-medical_info.dto';
import { UpdateMedicalInfoDto } from './dto/update-medical_info.dto';

@Injectable()
export class MedicalInfoService {
  create(createMedicalInfoDto: CreateMedicalInfoDto) {
    return 'This action adds a new medicalInfo';
  }

  findAll() {
    return `This action returns all medicalInfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medicalInfo`;
  }

  update(id: number, updateMedicalInfoDto: UpdateMedicalInfoDto) {
    return `This action updates a #${id} medicalInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicalInfo`;
  }
}
