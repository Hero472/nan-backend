import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserSend, UserType } from '../types';
import { Student } from './entities/student.entity';
import { LevelEnum } from '../enum';
import { Parent } from '../parent/entities/parent.entity';

describe('StudentController', () => {
  let studentController: StudentController;
  let studentService: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
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

    studentController = module.get<StudentController>(StudentController);
    studentService = module.get<StudentService>(StudentService);
  });

  describe('create', () => {
    it('should create a student and return user details', async () => {
      const createStudentDto: CreateStudentDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        id_parent: 1,
      };
      const result: UserSend = {
        name: createStudentDto.name,
        access_token: 'token',
        refresh_token: 'refresh_token',
        user_type: UserType.Student,
      };

      jest.spyOn(studentService, 'create').mockResolvedValue(result);

      expect(await studentController.create(createStudentDto)).toEqual(result);
      expect(studentService.create).toHaveBeenCalledWith(createStudentDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of students', async () => {
      const passwordBuffer = Buffer.from('your_password_here');

      const result: Student[] = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          id_student: 0,
          level: LevelEnum.Level1,
          password: passwordBuffer,
          recovery_code: null,
          recovery_code_expires_at: null,
          access_token: null,
          refresh_token: null,
          access_token_expires_at: null,
          refresh_token_expires_at: null,
          parent: new Parent(),
        },
      ];

      jest.spyOn(studentService, 'findAll').mockResolvedValue(result);

      expect(await studentController.findAll()).toEqual(result);
      expect(studentService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a student by access token', async () => {
      const access_token = 'valid_token';
      const result: UserSend = {
        name: 'John Doe',
        access_token,
        refresh_token: 'refresh_token',
        user_type: UserType.Student,
      };

      jest.spyOn(studentService, 'findOne').mockResolvedValue(result);

      expect(await studentController.findOne(access_token)).toEqual(result);
      expect(studentService.findOne).toHaveBeenCalledWith(access_token);
    });

    it('should throw NotFoundException if student not found', async () => {
      const access_token = 'invalid_token';
      jest
        .spyOn(studentService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(studentController.findOne(access_token)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('initialPasswordRecovery', () => {
    it('should initiate password recovery', async () => {
      const email = 'john@example.com';
      const result = { message: 'Recovery email sent' };

      jest
        .spyOn(studentService, 'initiatePasswordRecovery')
        .mockResolvedValue(result);

      expect(await studentController.initialPasswordRecovery(email)).toEqual(
        result,
      );
      expect(studentService.initiatePasswordRecovery).toHaveBeenCalledWith(
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
        .spyOn(studentService, 'verifyRecoveryCode')
        .mockResolvedValue(result);

      expect(
        await studentController.verifyPasswordRecovery(email, code),
      ).toEqual(result);
      expect(studentService.verifyRecoveryCode).toHaveBeenCalledWith(
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

      jest.spyOn(studentService, 'resetPassword').mockResolvedValue(result);

      expect(
        await studentController.resetPassword(email, code, newPassword),
      ).toEqual(result);
      expect(studentService.resetPassword).toHaveBeenCalledWith(
        email,
        code,
        newPassword,
      );
    });
  });

  // describe('update', () => {
  //   it('should update a student', async () => {
  //     const access_token = 'valid_token';
  //     const updateStudentDto: UpdateStudentDto = {
  //       name: 'Jane Doe',
  //       email: 'jane@example.com',
  //       password: 'new_password',
  //     };
  //     const result: UserSend = {
  //       name: updateStudentDto.name ?? 'Jane Doe',
  //       access_token,
  //       refresh_token: 'refresh_token',
  //       user_type: UserType.Student,
  //     };

  //     jest.spyOn(studentService, 'update').mockResolvedValue(result);

  //     expect(
  //       await studentController.update(access_token, updateStudentDto),
  //     ).toEqual(result);
  //     expect(studentService.update).toHaveBeenCalledWith(
  //       access_token,
  //       updateStudentDto,
  //     );
  //   });
  // });

  describe('remove', () => {
    it('should remove a student', async () => {
      const access_token = 'valid_token';
      const result: UserSend = {
        name: 'John Doe',
        access_token,
        refresh_token: 'refresh_token',
        user_type: UserType.Student,
      };

      jest.spyOn(studentService, 'remove').mockResolvedValue(result);

      expect(await studentController.remove(access_token)).toEqual(result);
      expect(studentService.remove).toHaveBeenCalledWith(access_token);
    });
  });
});
