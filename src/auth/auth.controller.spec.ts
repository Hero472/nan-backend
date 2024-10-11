import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { Student } from '../student/entities/student.entity';
import { Parent } from '../parent/entities/parent.entity';
import { Professor } from '../professor/entities/professor.entity';
import { UserType } from '../types';

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      loginStudent: jest.fn(),
      loginParent: jest.fn(),
      loginProfessor: jest.fn(),
      generateAccessTokenStudent: jest.fn(),
      generateRefreshTokenStudent: jest.fn(),
      updateStudentTokens: jest.fn(),
      generateAccessTokenParent: jest.fn(),
      generateRefreshTokenParent: jest.fn(),
      updateParentTokens: jest.fn(),
      generateAccessTokenProfessor: jest.fn(),
      generateRefreshTokenProfessor: jest.fn(),
      updateProfessorTokens: jest.fn(),
      verifyRefreshTokenStudent: jest.fn(),
      verifyRefreshTokenParent: jest.fn(),
      verifyRefreshTokenProfessor: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should log in a student and return tokens', async () => {
      const loginDto = { email: 'student@test.com', password: 'password', userType: UserType.Student };
      const student: Student = { id_student: 1, email: 'student@test.com' } as Student;
      (mockAuthService.loginStudent as jest.Mock).mockResolvedValue({ bool: true, student });
      (mockAuthService.generateAccessTokenStudent as jest.Mock).mockResolvedValue('access_token');
      (mockAuthService.generateRefreshTokenStudent as jest.Mock).mockResolvedValue('refresh_token');

      const result = await authController.login(loginDto);

      expect(mockAuthService.loginStudent).toHaveBeenCalledWith({ email: 'student@test.com', password: 'password' });
      expect(mockAuthService.generateAccessTokenStudent).toHaveBeenCalledWith(student);
      expect(mockAuthService.generateRefreshTokenStudent).toHaveBeenCalledWith(student);
      expect(result).toEqual({ accessToken: 'access_token', refreshToken: 'refresh_token' });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto = { email: 'student@test.com', password: 'password', userType: UserType.Student };
      (mockAuthService.loginStudent as jest.Mock).mockResolvedValue({ bool: false, student: null });

      await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should log in a parent and return tokens', async () => {
      const loginDto = { email: 'parent@test.com', password: 'password', userType: UserType.Parent };
      const parent: Parent = { id_parent: 1, email: 'parent@test.com' } as Parent;
      (mockAuthService.loginParent as jest.Mock).mockResolvedValue({ bool: true, parent });
      (mockAuthService.generateAccessTokenParent as jest.Mock).mockResolvedValue('access_token');
      (mockAuthService.generateRefreshTokenParent as jest.Mock).mockResolvedValue('refresh_token');

      const result = await authController.login(loginDto);

      expect(mockAuthService.loginParent).toHaveBeenCalledWith({ email: 'parent@test.com', password: 'password' });
      expect(mockAuthService.generateAccessTokenParent).toHaveBeenCalledWith(parent);
      expect(mockAuthService.generateRefreshTokenParent).toHaveBeenCalledWith(parent);
      expect(result).toEqual({ accessToken: 'access_token', refreshToken: 'refresh_token' });
    });

    it('should log in a professor and return tokens', async () => {
      const loginDto = { email: 'professor@test.com', password: 'password', userType: UserType.Professor };
      const professor: Professor = { id_professor: 1, email: 'professor@test.com' } as Professor;
      (mockAuthService.loginProfessor as jest.Mock).mockResolvedValue({ bool: true, professor });
      (mockAuthService.generateAccessTokenProfessor as jest.Mock).mockResolvedValue('access_token');
      (mockAuthService.generateRefreshTokenProfessor as jest.Mock).mockResolvedValue('refresh_token');

      const result = await authController.login(loginDto);

      expect(mockAuthService.loginProfessor).toHaveBeenCalledWith({ email: 'professor@test.com', password: 'password' });
      expect(mockAuthService.generateAccessTokenProfessor).toHaveBeenCalledWith(professor);
      expect(mockAuthService.generateRefreshTokenProfessor).toHaveBeenCalledWith(professor);
      expect(result).toEqual({ accessToken: 'access_token', refreshToken: 'refresh_token' });
    });
  });

  describe('refresh', () => {
    it('should refresh tokens for a student', async () => {
      const body = { refreshToken: 'valid_refresh_token', userType: UserType.Student };
      const student: Student = { id_student: 1 } as Student;
      (mockAuthService.verifyRefreshTokenStudent as jest.Mock).mockResolvedValue(student);
      (mockAuthService.generateAccessTokenStudent as jest.Mock).mockResolvedValue('new_access_token');
      (mockAuthService.generateRefreshTokenStudent as jest.Mock).mockResolvedValue('new_refresh_token');

      const result = await authController.refresh(body);

      expect(mockAuthService.verifyRefreshTokenStudent).toHaveBeenCalledWith('valid_refresh_token');
      expect(mockAuthService.generateAccessTokenStudent).toHaveBeenCalledWith(student);
      expect(mockAuthService.generateRefreshTokenStudent).toHaveBeenCalledWith(student);
      expect(result).toEqual({ accessToken: 'new_access_token', refreshToken: 'new_refresh_token' });
    });

    it('should refresh tokens for a parent', async () => {
      const body = { refreshToken: 'valid_refresh_token', userType: UserType.Parent };
      const parent: Parent = { id_parent: 1 } as Parent;
      (mockAuthService.verifyRefreshTokenParent as jest.Mock).mockResolvedValue(parent);
      (mockAuthService.generateAccessTokenParent as jest.Mock).mockResolvedValue('new_access_token');
      (mockAuthService.generateRefreshTokenParent as jest.Mock).mockResolvedValue('new_refresh_token');

      const result = await authController.refresh(body);

      expect(mockAuthService.verifyRefreshTokenParent).toHaveBeenCalledWith('valid_refresh_token');
      expect(mockAuthService.generateAccessTokenParent).toHaveBeenCalledWith(parent);
      expect(mockAuthService.generateRefreshTokenParent).toHaveBeenCalledWith(parent);
      expect(result).toEqual({ accessToken: 'new_access_token', refreshToken: 'new_refresh_token' });
    });

    it('should refresh tokens for a professor', async () => {
      const body = { refreshToken: 'valid_refresh_token', userType: UserType.Professor };
      const professor: Professor = { id_professor: 1 } as Professor;
      (mockAuthService.verifyRefreshTokenProfessor as jest.Mock).mockResolvedValue(professor);
      (mockAuthService.generateAccessTokenProfessor as jest.Mock).mockResolvedValue('new_access_token');
      (mockAuthService.generateRefreshTokenProfessor as jest.Mock).mockResolvedValue('new_refresh_token');

      const result = await authController.refresh(body);

      expect(mockAuthService.verifyRefreshTokenProfessor).toHaveBeenCalledWith('valid_refresh_token');
      expect(mockAuthService.generateAccessTokenProfessor).toHaveBeenCalledWith(professor);
      expect(mockAuthService.generateRefreshTokenProfessor).toHaveBeenCalledWith(professor);
      expect(result).toEqual({ accessToken: 'new_access_token', refreshToken: 'new_refresh_token' });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const body = { refreshToken: 'invalid_refresh_token', userType:  UserType.Student };
      (mockAuthService.verifyRefreshTokenStudent as jest.Mock).mockResolvedValue(null);

      await expect(authController.refresh(body)).rejects.toThrow(UnauthorizedException);
    });

  });
});