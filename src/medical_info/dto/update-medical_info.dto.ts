import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalInfoDto } from './create-medical_info.dto';

export class UpdateMedicalInfoDto extends PartialType(CreateMedicalInfoDto) {}
