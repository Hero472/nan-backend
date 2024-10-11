import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorService } from './professor.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Professor } from './entities/professor.entity';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserType } from '../types';

describe('ProfessorService', () => {
  let service: ProfessorService;
  let professorRepository: Repository<Professor>;
  let mailService: MailService;
  let jwtService: JwtService;

  const mockprofessorRepository = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
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
        ProfessorService,
        { provide: getRepositoryToken(Professor), useFactory: mockprofessorRepository },
        { provide: MailService, useFactory: mockMailService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<ProfessorService>(ProfessorService);
    professorRepository = module.get<Repository<Professor>>(getRepositoryToken(Professor));
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a professor and return user details', async () => {
      const createprofessorDto = { name: 'John Doe', email: 'john@example.com', password: 'password', id_parent: 1 };
  
      professorRepository.create = jest.fn().mockReturnValue(createprofessorDto);
      professorRepository.save = jest.fn().mockResolvedValue({ ...createprofessorDto, access_token: 'token', refresh_token: 'refresh_token' });
  
      const result = await service.create(createprofessorDto);
  
      expect(result).toEqual({
        name: createprofessorDto.name,
        access_token: 'token',
        refresh_token: 'refresh_token',
        user_type: UserType.Professor,
      });
      expect(professorRepository.save).toHaveBeenCalled();
    });
  });

  describe('initiatePasswordRecovery', () => {
    it('should send recovery email', async () => {
      const email = 'john@example.com';
      const professor = { email, recovery_code: null, recovery_code_expires_at: null };
  
      professorRepository.findOne = jest.fn().mockResolvedValue(professor);
      mailService.sendRecoveryEmail = jest.fn();
  
      const result = await service.initiatePasswordRecovery(email);
  
      expect(result).toEqual({ message: 'Recovery email sent' });
      expect(mailService.sendRecoveryEmail).toHaveBeenCalledWith(email, expect.any(String));
    });
  
    it('should throw NotFoundException if professor not found', async () => {
      const email = 'john@example.com';
  
      professorRepository.findOne = jest.fn().mockResolvedValue(null);
  
      await expect(service.initiatePasswordRecovery(email)).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('should reset the password successfully', async () => {
      const email = 'john@example.com';
      const code = 'recovery_code';
      const newPassword = 'new_password';
      const professor = {
        email,
        recovery_code: code,
        recovery_code_expires_at: new Date(Date.now() + 3600 * 1000),
        password: null,
      };
  
      professorRepository.findOne = jest.fn().mockResolvedValue(professor);
      professorRepository.save = jest.fn();
  
      const result = await service.resetPassword(email, code, newPassword);
  
      expect(result).toEqual({ message: 'Password reset successfully' });
      expect(professorRepository.save).toHaveBeenCalled();
    });
  
    it('should throw BadRequestException if recovery code is invalid or expired', async () => {
      const email = 'john@example.com';
      const code = 'invalid_code';
  
      professorRepository.findOne = jest.fn().mockResolvedValue(null);
  
      await expect(service.resetPassword(email, code, 'new_password')).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a professor', async () => {
      const access_token = 'valid_token';
      const updateprofessorDto = { name: 'Jane Doe', email: 'jane@example.com', password: 'new_password' };
      const decodedToken = { sub: 1 };
      const professor = { id_professor: 1 , access_token: "token", refresh_token: "refresh token" , ...updateprofessorDto };
  
      jwtService.verify = jest.fn().mockReturnValue(decodedToken);
      professorRepository.findOne = jest.fn().mockResolvedValue(professor);
      professorRepository.save = jest.fn().mockResolvedValue(professor);
  
      const result = await service.update(access_token, updateprofessorDto);
  
      expect(result).toEqual({
        name: updateprofessorDto.name,
        access_token: professor.access_token,
        refresh_token: professor.refresh_token,
        user_type: UserType.Professor,
      });
    });
  
    it('should throw NotFoundException if professor not found', async () => {
      const access_token = 'valid_token';
      const updateprofessorDto = { name: 'Jane Doe' };
  
      jwtService.verify = jest.fn().mockReturnValue({ sub: 1 });
      professorRepository.findOne = jest.fn().mockResolvedValue(null);
  
      await expect(service.update(access_token, updateprofessorDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a professor', async () => {
      const token = 'valid_token';
      const decodedToken = { sub: 1, email: 'john@example.com' };
      const professor = { id_professor: 1, name: 'John Doe', access_token: "token", refresh_token: "refresh token" };
  
      jwtService.verify = jest.fn().mockReturnValue(decodedToken);
      professorRepository.findOne = jest.fn().mockResolvedValue(professor);
      professorRepository.remove = jest.fn();
  
      const result = await service.remove(token);
  
      expect(result).toEqual({
        name: professor.name,
        access_token: professor.access_token,
        refresh_token: professor.refresh_token,
        user_type: expect.any(String),
      });
      expect(professorRepository.remove).toHaveBeenCalledWith(professor);
    });
  
    it('should throw NotFoundException if professor not found', async () => {
      const token = 'valid_token';
      const decodedToken = { sub: 1, email: 'john@example.com' };
  
      jwtService.verify = jest.fn().mockReturnValue(decodedToken);
      professorRepository.findOne = jest.fn().mockResolvedValue(null);
  
      await expect(service.remove(token)).rejects.toThrow(NotFoundException);
    });
  });

});
