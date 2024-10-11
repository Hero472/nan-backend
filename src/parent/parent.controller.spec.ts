import { Test, TestingModule } from '@nestjs/testing';
import { ParentController } from './parent.controller';
import { ParentService } from './parent.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UserSend, UserType } from '../types';
import { Parent } from './entities/parent.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateParentDto } from './dto/update-parent.dto';

describe('ParentController', () => {
  let parentController: ParentController;
  let parentService: ParentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentController],
      providers: [
        {
          provide: ParentService,
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

    parentController = module.get<ParentController>(ParentController);
    parentService = module.get<ParentService>(ParentService);
  });

  describe('create', () => {
    it('should create a parent and return user details', async () => {
      const createParentDto: CreateParentDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };
      const result: UserSend = {
        name: createParentDto.name,
        access_token: 'token',
        refresh_token: 'refresh_token',
        user_type: UserType.Parent,
      };

      jest.spyOn(parentService, 'create').mockResolvedValue(result);

      expect(await parentController.create(createParentDto)).toEqual(result);
      expect(parentService.create).toHaveBeenCalledWith(createParentDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of parent', async () => {
      const passwordBuffer = Buffer.from('your_password_here');

      const result: Parent[] = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          id_parent: 0,
          password: passwordBuffer,
          recovery_code: null,
          recovery_code_expires_at: null,
          access_token: null,
          refresh_token: null,
          access_token_expires_at: null,
          refresh_token_expires_at: null,
          students: []
        },
      ];

      jest.spyOn(parentService, 'findAll').mockResolvedValue(result);

      expect(await parentController.findAll()).toEqual(result);
      expect(parentService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a parent by access token', async () => {
      const access_token = 'valid_token';
      const result: UserSend = {
        name: 'John Doe',
        access_token,
        refresh_token: 'refresh_token',
        user_type: UserType.Parent,
      };

      jest.spyOn(parentService, 'findOne').mockResolvedValue(result);

      expect(await parentController.findOne(access_token)).toEqual(result);
      expect(parentService.findOne).toHaveBeenCalledWith(access_token);
    });

    it('should throw NotFoundException if parent not found', async () => {
      const access_token = 'invalid_token';
      jest
        .spyOn(parentService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(parentController.findOne(access_token)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('initialPasswordRecovery', () => {
    it('should initiate password recovery', async () => {
      const email = 'john@example.com';
      const result = { message: 'Recovery email sent' };

      jest
        .spyOn(parentService, 'initiatePasswordRecovery')
        .mockResolvedValue(result);

      expect(await parentController.initialPasswordRecovery(email)).toEqual(
        result,
      );
      expect(parentService.initiatePasswordRecovery).toHaveBeenCalledWith(
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
        .spyOn(parentService, 'verifyRecoveryCode')
        .mockResolvedValue(result);

      expect(
        await parentController.verifyPasswordRecovery(email, code),
      ).toEqual(result);
      expect(parentService.verifyRecoveryCode).toHaveBeenCalledWith(
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

      jest.spyOn(parentService, 'resetPassword').mockResolvedValue(result);

      expect(
        await parentController.resetPassword(email, code, newPassword),
      ).toEqual(result);
      expect(parentService.resetPassword).toHaveBeenCalledWith(
        email,
        code,
        newPassword,
      );
    });
  });

  describe('update', () => {
    it('should update a parent', async () => {
      const access_token = 'valid_token';
      const updateParentDto: UpdateParentDto = {
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'new_password',
      };
  
      const result: UserSend = {
          name: updateParentDto.name ?? 'Jane Doe',
          access_token,
          refresh_token: 'refresh_token',
          user_type: UserType.Parent,
      };
  
      jest.spyOn(parentService, 'update').mockResolvedValue(result);
  
      expect(
          await parentController.update(access_token, updateParentDto),
      ).toEqual(result);
      expect(parentService.update).toHaveBeenCalledWith(
          access_token,
          updateParentDto,
      );
  });
  });

  describe('remove', () => {
    it('should remove a parent', async () => {
      const access_token = 'valid_token';
      const result: UserSend = {
        name: 'John Doe',
        access_token,
        refresh_token: 'refresh_token',
        user_type: UserType.Parent,
      };

      jest.spyOn(parentService, 'remove').mockResolvedValue(result);

      expect(await parentController.remove(access_token)).toEqual(result);
      expect(parentService.remove).toHaveBeenCalledWith(access_token);
    });
  });
});
