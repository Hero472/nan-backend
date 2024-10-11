import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorController } from './professor.controller';
import { ProfessorService } from './professor.service';
import { UserSend, UserType } from '../types';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { Professor } from './entities/professor.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateProfessorDto } from './dto/update-professor.dto';

describe('ProfessorController', () => {
  let professorController: ProfessorController;
  let professorService: ProfessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessorController],
      providers: [
        {
          provide: ProfessorService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            initiatePasswordRecovery: jest.fn(),
            verifyRecoveryCode: jest.fn(),
            resetPassword: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    professorController = module.get<ProfessorController>(ProfessorController);
    professorService = module.get<ProfessorService>(ProfessorService);
  });

  describe('create', () => {
    it('should create a professor and return user details', async () => {
      const createProfessorDto: CreateProfessorDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };
      const result: UserSend = {
        name: createProfessorDto.name,
        access_token: 'token',
        refresh_token: 'refresh_token',
        user_type: UserType.Professor,
      };

      jest.spyOn(professorService, 'create').mockResolvedValue(result);

      expect(await professorController.create(createProfessorDto)).toEqual(result);
      expect(professorService.create).toHaveBeenCalledWith(createProfessorDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of professor', async () => {
      const passwordBuffer = Buffer.from('your_password_here');

      const result: Professor[] = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          id_professor: 0,
          password: passwordBuffer,
          recovery_code: null,
          recovery_code_expires_at: null,
          access_token: null,
          refresh_token: null,
          access_token_expires_at: null,
          refresh_token_expires_at: null,
        },
      ];

      jest.spyOn(professorService, 'findAll').mockResolvedValue(result);

      expect(await professorController.findAll()).toEqual(result);
      expect(professorService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a professor by access token', async () => {
      const access_token = 'valid_token';
      const result: UserSend = {
        name: 'John Doe',
        access_token,
        refresh_token: 'refresh_token',
        user_type: UserType.Professor,
      };

      jest.spyOn(professorService, 'findOne').mockResolvedValue(result);

      expect(await professorController.findOne(access_token)).toEqual(result);
      expect(professorService.findOne).toHaveBeenCalledWith(access_token);
    });

    it('should throw NotFoundException if student not found', async () => {
      const access_token = 'invalid_token';
      jest
        .spyOn(professorService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(professorController.findOne(access_token)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('initialPasswordRecovery', () => {
    it('should initiate password recovery', async () => {
      const email = 'john@example.com';
      const result = { message: 'Recovery email sent' };

      jest
        .spyOn(professorService, 'initiatePasswordRecovery')
        .mockResolvedValue(result);

      expect(await professorController.initialPasswordRecovery(email)).toEqual(
        result,
      );
      expect(professorService.initiatePasswordRecovery).toHaveBeenCalledWith(
        email,
      );
    });
  });

  describe('verifyPasswordRecovery', () => {
    it('should verify password recovery code', async () => {
      const email = 'john@example.com';
      const code = '123456';
      const result = { message: 'Code verified, proceed to reset password' };

      jest
        .spyOn(professorService, 'verifyRecoveryCode')
        .mockResolvedValue(result);

      expect(
        await professorController.verifyPasswordRecovery(email, code),
      ).toEqual(result);
      expect(professorService.verifyRecoveryCode).toHaveBeenCalledWith(
        email,
        code,
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset password', async () => {
      const email = 'john@example.com';
      const code = '123456';
      const newPassword = 'new_password';
      const result = { message: 'Password reset successfully' };

      jest.spyOn(professorService, 'resetPassword').mockResolvedValue(result);

      expect(
        await professorController.resetPassword(email, code, newPassword),
      ).toEqual(result);
      expect(professorService.resetPassword).toHaveBeenCalledWith(
        email,
        code,
        newPassword,
      );
    });
  });

  describe('update', () => {
    it('should update a professor', async () => {
      const access_token = 'valid_token';
      const updateProfessorDto: UpdateProfessorDto = {
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'new_password',
      };
  
      const result: UserSend = {
          name: updateProfessorDto.name ?? 'Jane Doe',
          access_token,
          refresh_token: 'refresh_token',
          user_type: UserType.Professor,
      };
  
      jest.spyOn(professorService, 'update').mockResolvedValue(result);
  
      expect(
          await professorController.update(access_token, updateProfessorDto),
      ).toEqual(result);
      expect(professorService.update).toHaveBeenCalledWith(
          access_token,
          updateProfessorDto,
      );
  });
  });

  describe('remove', () => {
    it('should remove a professor', async () => {
      const access_token = 'valid_token';
      const result: UserSend = {
        name: 'John Doe',
        access_token,
        refresh_token: 'refresh_token',
        user_type: UserType.Professor,
      };

      jest.spyOn(professorService, 'remove').mockResolvedValue(result);

      expect(await professorController.remove(access_token)).toEqual(result);
      expect(professorService.remove).toHaveBeenCalledWith(access_token);
    });
  });
});
