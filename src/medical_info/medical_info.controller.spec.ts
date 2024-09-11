import { Test, TestingModule } from '@nestjs/testing';
import { MedicalInfoController } from './medical_info.controller';
import { MedicalInfoService } from './medical_info.service';

describe('MedicalInfoController', () => {
  let controller: MedicalInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalInfoController],
      providers: [MedicalInfoService],
    }).compile();

    controller = module.get<MedicalInfoController>(MedicalInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
