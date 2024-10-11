import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Parent } from '../parent/entities/parent.entity';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserType } from '../types';

describe('StudentService', () => {
  let service: StudentService;
  let studentRepository: Repository<Student>;
  let parentRepository: Repository<Parent>;
  let mailService: MailService;
  let jwtService: JwtService;

  const mockStudentRepository = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
  });
  
  const mockParentRepository = () => ({
    findOne: jest.fn(),
  });
  
  const mockMailService = () => ({
    sendRecoveryEmail: jest.fn(),
  });
  
  const mockJwtService = () => ({
    verify: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        { provide: getRepositoryToken(Student), useFactory: mockStudentRepository },
        { provide: getRepositoryToken(Parent), useFactory: mockParentRepository },
        { provide: MailService, useFactory: mockMailService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentRepository = module.get<Repository<Student>>(getRepositoryToken(Student));
    parentRepository = module.get<Repository<Parent>>(getRepositoryToken(Parent));
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a student and return user details', async () => {
      const createStudentDto = { name: 'John Doe', email: 'john@example.com', password: 'password', id_parent: 1 };
      const parent = { id_parent: 1 };
  
      parentRepository.findOne = jest.fn().mockResolvedValue(parent);
      studentRepository.create = jest.fn().mockReturnValue(createStudentDto);
      studentRepository.save = jest.fn().mockResolvedValue({ ...createStudentDto, access_token: 'token', refresh_token: 'refresh_token' });
  
      const result = await service.create(createStudentDto);
  
      expect(result).toEqual({
        name: createStudentDto.name,
        access_token: 'token',
        refresh_token: 'refresh_token',
        user_type: UserType.Student,
      });
      expect(studentRepository.save).toHaveBeenCalled();
    });
  
    it('should throw NotFoundException if parent not found', async () => {
      const createStudentDto = { name: 'John Doe', email: 'john@example.com', password: 'password', id_parent: 1 };
  
      parentRepository.findOne = jest.fn().mockResolvedValue(null);
  
      await expect(service.create(createStudentDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('initiatePasswordRecovery', () => {
    it('should send recovery email', async () => {
      const email = 'john@example.com';
      const student = { email, recovery_code: null, recovery_code_expires_at: null };
  
      studentRepository.findOne = jest.fn().mockResolvedValue(student);
      mailService.sendRecoveryEmail = jest.fn();
  
      const result = await service.initiatePasswordRecovery(email);
  
      expect(result).toEqual({ message: 'Recovery email sent' });
      expect(mailService.sendRecoveryEmail).toHaveBeenCalledWith(email, expect.any(String));
    });
  
    it('should throw NotFoundException if student not found', async () => {
      const email = 'john@example.com';
  
      studentRepository.findOne = jest.fn().mockResolvedValue(null);
  
      await expect(service.initiatePasswordRecovery(email)).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('should reset the password successfully', async () => {
      const email = 'john@example.com';
      const code = 'recovery_code';
      const newPassword = 'new_password';
      const student = {
        email,
        recovery_code: code,
        recovery_code_expires_at: new Date(Date.now() + 3600 * 1000),
        password: null,
      };
  
      studentRepository.findOne = jest.fn().mockResolvedValue(student);
      studentRepository.save = jest.fn();
  
      const result = await service.resetPassword(email, code, newPassword);
  
      expect(result).toEqual({ message: 'Password reset successfully' });
      expect(studentRepository.save).toHaveBeenCalled();
    });
  
    it('should throw BadRequestException if recovery code is invalid or expired', async () => {
      const email = 'john@example.com';
      const code = 'invalid_code';
  
      studentRepository.findOne = jest.fn().mockResolvedValue(null);
  
      await expect(service.resetPassword(email, code, 'new_password')).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const access_token = 'valid_token';
      const updateStudentDto = { name: 'Jane Doe', email: 'jane@example.com', password: 'new_password' };
      const decodedToken = { sub: 1 };
      const student = { id_student: 1 , access_token: "token", refresh_token: "refresh token" , ...updateStudentDto };
  
      jwtService.verify = jest.fn().mockReturnValue(decodedToken);
      studentRepository.findOne = jest.fn().mockResolvedValue(student);
      studentRepository.save = jest.fn().mockResolvedValue(student);
  
      const result = await service.update(access_token, updateStudentDto);
  
      expect(result).toEqual({
        name: updateStudentDto.name,
        access_token: student.access_token,
        refresh_token: student.refresh_token,
        user_type: UserType.Student,
      });
    });
  
    it('should throw NotFoundException if student not found', async () => {
      const access_token = 'valid_token';
      const updateStudentDto = { name: 'Jane Doe' };
  
      jwtService.verify = jest.fn().mockReturnValue({ sub: 1 });
      studentRepository.findOne = jest.fn().mockResolvedValue(null);
  
      await expect(service.update(access_token, updateStudentDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a student', async () => {
      const token = 'valid_token';
      const decodedToken = { sub: 1, email: 'john@example.com' };
      const student = { id_student: 1, name: 'John Doe', access_token: "token", refresh_token: "refresh token" };
  
      jwtService.verify = jest.fn().mockReturnValue(decodedToken);
      studentRepository.findOne = jest.fn().mockResolvedValue(student);
      studentRepository.remove = jest.fn();
  
      const result = await service.remove(token);
  
      expect(result).toEqual({
        name: student.name,
        access_token: student.access_token,
        refresh_token: student.refresh_token,
        user_type: expect.any(String),
      });
      expect(studentRepository.remove).toHaveBeenCalledWith(student);
    });
  
    it('should throw NotFoundException if student not found', async () => {
      const token = 'valid_token';
      const decodedToken = { sub: 1, email: 'john@example.com' };
  
      jwtService.verify = jest.fn().mockReturnValue(decodedToken);
      studentRepository.findOne = jest.fn().mockResolvedValue(null);
  
      await expect(service.remove(token)).rejects.toThrow(NotFoundException);
    });
  });

});
