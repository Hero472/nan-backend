import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from '../student/entities/student.entity';
import { Parent } from '../parent/entities/parent.entity';
import { Professor } from '../professor/entities/professor.entity';
import * as bcrypt from 'bcrypt';
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserType } from '../types';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockStudentRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockProfessorRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockParentRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: getRepositoryToken(Student),
          useValue: mockStudentRepository,
        },
        { provide: getRepositoryToken(Parent), useValue: mockParentRepository },
        {
          provide: getRepositoryToken(Professor),
          useValue: mockProfessorRepository,
        },
      ],
    }).compile();
    (bcrypt.compare as jest.Mock).mockReset();
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });



  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  // Test for generateAccessTokenStudent
  describe('generateAccessTokenStudent', () => {
    it('should generate an access token for a student', async () => {
      const student: Student = {
        id_student: 1,
        email: 'test@test.com',
      } as Student;
      mockJwtService.sign.mockReturnValue('access_token');

      const token = await authService.generateAccessTokenStudent(student);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { sub: student.id_student, email: student.email },
        { expiresIn: '1h' },
      );
      expect(token).toBe('access_token');
    });
  });

  // Test for generateRefreshTokenStudent
  describe('generateRefreshTokenStudent', () => {
    it('should generate a refresh token for a student', async () => {
      const student: Student = {
        id_student: 1,
        email: 'test@test.com',
      } as Student;
      mockJwtService.sign.mockReturnValue('refresh_token');

      const token = await authService.generateRefreshTokenStudent(student);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { sub: student.id_student, email: student.email },
        { expiresIn: '7d' },
      );
      expect(token).toBe('refresh_token');
    });
  });

  // Test for verifyAccessTokenStudent
  describe('verifyAccessTokenStudent', () => {
    it('should return a student if access token is valid and not expired', async () => {
      const student: Student = {
        id_student: 1,
        access_token_expires_at: new Date(Date.now() + 1000 * 3600),
      } as Student;
      mockJwtService.verify.mockReturnValue({ sub: 1 });
      mockStudentRepository.findOne.mockResolvedValue(student);

      const result = await authService.verifyAccessTokenStudent('access_token');

      expect(mockJwtService.verify).toHaveBeenCalledWith('access_token', {
        secret: process.env.JWT_SECRET,
      });
      expect(mockStudentRepository.findOne).toHaveBeenCalledWith({
        where: { id_student: 1 },
      });
      expect(result).toBe(student);
    });

    it('should return null if access token is invalid or expired', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });
      const result =
        await authService.verifyAccessTokenStudent('invalid_token');

      expect(result).toBeNull();
    });
  });

  // Test for verifyRefreshTokenStudent
  describe('verifyRefreshTokenStudent', () => {
    it('should return a student if refresh token is valid and not expired', async () => {
      const student: Student = {
        id_student: 1,
        refresh_token: 'valid_refresh_token',
        refresh_token_expires_at: new Date(Date.now() + 1000 * 3600),
      } as Student;
      mockJwtService.verify.mockReturnValue({ sub: 1 });
      mockStudentRepository.findOne.mockResolvedValue(student);

      const result = await authService.verifyRefreshTokenStudent(
        'valid_refresh_token',
      );

      expect(mockJwtService.verify).toHaveBeenCalledWith(
        'valid_refresh_token',
        { secret: process.env.JWT_SECRET },
      );
      expect(mockStudentRepository.findOne).toHaveBeenCalledWith({
        where: { id_student: 1 },
      });
      expect(result).toBe(student);
    });

    it('should return null if refresh token is invalid or expired', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });
      const result =
        await authService.verifyRefreshTokenStudent('invalid_token');

      expect(result).toBeNull();
    });
  });

  // Test for validateStudent
  describe('validateStudent', () => {
    it('should return student if credentials are valid', async () => {
      const student: Student = {
        email: 'test@test.com',
        password: 'hashed_password',
      } as unknown as Student;
      mockStudentRepository.findOne.mockResolvedValue(student);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateStudent(
        'test@test.com',
        'password',
      );

      expect(mockStudentRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', student.password);
      expect(result).toBe(student);
    });

    it('should return null if credentials are invalid', async () => {
      mockStudentRepository.findOne.mockResolvedValue(null);
      const result = await authService.validateStudent(
        'test@test.com',
        'password',
      );

      expect(result).toBeNull();
    });
  });

  // Test for loginStudent
  describe('loginStudent', () => {
    it('should return a student if login is successful', async () => {
      const loginDto = { email: 'test@test.com', password: 'password', userType: UserType.Student };
      const student: Student = {
        email: 'test@test.com',
        password: 'hashed_password',
      } as unknown as Student;
      mockStudentRepository.findOne.mockResolvedValue(student);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.loginStudent(loginDto);

      expect(mockStudentRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
      expect(result).toEqual({ bool: true, student });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto = { email: 'test@test.com', password: 'wrong_password' };
      mockStudentRepository.findOne.mockResolvedValue(null);

      await expect(authService.loginStudent(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      const loginDto = { email: 'test@test.com', password: 'password' };
      mockStudentRepository.findOne.mockImplementation(() => {
        throw new Error();
      });

      await expect(authService.loginStudent(loginDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // Test for generateAccessTokenProfessor
  describe('generateAccessTokenProfessor', () => {
    it('should generate an access token for a professor', async () => {
      const professor: Professor = {
        id_professor: 1,
        email: 'professor@test.com',
      } as Professor;
      mockJwtService.sign.mockReturnValue('access_token');

      const token = await authService.generateAccessTokenProfessor(professor);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { sub: professor.id_professor, email: professor.email },
        { expiresIn: '1h' },
      );
      expect(token).toBe('access_token');
    });
  });

  // Test for generateRefreshTokenProfessor
  describe('generateRefreshTokenProfessor', () => {
    it('should generate a refresh token for a professor', async () => {
      const professor: Professor = {
        id_professor: 1,
        email: 'professor@test.com',
      } as Professor;
      mockJwtService.sign.mockReturnValue('refresh_token');

      const token = await authService.generateRefreshTokenProfessor(professor);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { sub: professor.id_professor, email: professor.email },
        { expiresIn: '7d' },
      );
      expect(token).toBe('refresh_token');
    });
  });

  // Test for verifyAccessTokenProfessor
  describe('verifyAccessTokenProfessor', () => {
    it('should return a professor if access token is valid and not expired', async () => {
      const professor: Professor = {
        id_professor: 1,
        access_token_expires_at: new Date(Date.now() + 1000 * 3600),
      } as Professor;
      mockJwtService.verify.mockReturnValue({ sub: 1 });
      mockProfessorRepository.findOne.mockResolvedValue(professor);

      const result =
        await authService.verifyAccessTokenProfessor('access_token');

      expect(mockJwtService.verify).toHaveBeenCalledWith('access_token', {
        secret: process.env.JWT_SECRET,
      });
      expect(mockProfessorRepository.findOne).toHaveBeenCalledWith({
        where: { id_professor: 1 },
      });
      expect(result).toBe(professor);
    });

    it('should return null if access token is invalid or expired', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });
      const result =
        await authService.verifyAccessTokenProfessor('invalid_token');

      expect(result).toBeNull();
    });
  });

  // Test for verifyRefreshTokenProfessor
  describe('verifyRefreshTokenProfessor', () => {
    it('should return a professor if refresh token is valid and not expired', async () => {
      const professor: Professor = {
        id_professor: 1,
        refresh_token: 'valid_refresh_token',
        refresh_token_expires_at: new Date(Date.now() + 1000 * 3600),
      } as Professor;
      mockJwtService.verify.mockReturnValue({ sub: 1 });
      mockProfessorRepository.findOne.mockResolvedValue(professor);

      const result = await authService.verifyRefreshTokenProfessor(
        'valid_refresh_token',
      );

      expect(mockJwtService.verify).toHaveBeenCalledWith(
        'valid_refresh_token',
        { secret: process.env.JWT_SECRET },
      );
      expect(mockProfessorRepository.findOne).toHaveBeenCalledWith({
        where: { id_professor: 1 },
      });
      expect(result).toBe(professor);
    });

    it('should return null if refresh token is invalid or expired', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });
      const result =
        await authService.verifyRefreshTokenProfessor('invalid_token');

      expect(result).toBeNull();
    });
  });

  // Test for validateProfessor
  describe('validateProfessor', () => {
    it('should return professor if credentials are valid', async () => {
      const professor: Professor = {
        email: 'professor@test.com',
        password: 'hashed_password',
      } as unknown as Professor;
      mockProfessorRepository.findOne.mockResolvedValue(professor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateProfessor(
        'professor@test.com',
        'password',
      );

      expect(mockProfessorRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'professor@test.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password',
        professor.password,
      );
      expect(result).toBe(professor);
    });

    it('should return null if credentials are invalid', async () => {
      mockProfessorRepository.findOne.mockResolvedValue(null);
      const result = await authService.validateProfessor(
        'professor@test.com',
        'password',
      );

      expect(result).toBeNull();
    });
  });

  // Test for loginProfessor
  describe('loginProfessor', () => {
    it('should return a professor if login is successful', async () => {
      const loginDto = { email: 'professor@test.com', password: 'password' };
      const professor: Professor = {
        email: 'professor@test.com',
        password: 'hashed_password',
      } as unknown as Professor;
      mockProfessorRepository.findOne.mockResolvedValue(professor);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.loginProfessor(loginDto);

      expect(mockProfessorRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'professor@test.com' },
      });
      expect(result).toEqual({ bool: true, professor });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto = {
        email: 'professor@test.com',
        password: 'wrong_password',
      };
      mockProfessorRepository.findOne.mockResolvedValue(null);

      await expect(authService.loginProfessor(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      const loginDto = { email: 'professor@test.com', password: 'password' };
      mockProfessorRepository.findOne.mockImplementation(() => {
        throw new Error();
      });

      await expect(authService.loginProfessor(loginDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // Test for generateAccessTokenParent
  describe('generateAccessTokenParent', () => {
    it('should generate an access token for a parent', async () => {
      const parent: Parent = {
        id_parent: 1,
        email: 'parent@test.com',
      } as Parent;
      mockJwtService.sign.mockReturnValue('access_token');

      const token = await authService.generateAccessTokenParent(parent);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { sub: parent.id_parent, email: parent.email },
        { expiresIn: '1h' },
      );
      expect(token).toBe('access_token');
    });
  });

  // Test for generateRefreshTokenParent
  describe('generateRefreshTokenParent', () => {
    it('should generate a refresh token for a parent', async () => {
      const parent: Parent = {
        id_parent: 1,
        email: 'parent@test.com',
      } as Parent;
      mockJwtService.sign.mockReturnValue('refresh_token');

      const token = await authService.generateRefreshTokenParent(parent);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { sub: parent.id_parent, email: parent.email },
        { expiresIn: '7d' },
      );
      expect(token).toBe('refresh_token');
    });
  });

  // Test for verifyAccessTokenParent
  describe('verifyAccessTokenParent', () => {
    it('should return a parent if access token is valid and not expired', async () => {
      const parent: Parent = {
        id_parent: 1,
        access_token_expires_at: new Date(Date.now() + 1000 * 3600),
      } as Parent;
      mockJwtService.verify.mockReturnValue({ sub: 1 });
      mockParentRepository.findOne.mockResolvedValue(parent);

      const result = await authService.verifyAccessTokenParent('access_token');

      expect(mockJwtService.verify).toHaveBeenCalledWith('access_token', {
        secret: process.env.JWT_SECRET,
      });
      expect(mockParentRepository.findOne).toHaveBeenCalledWith({
        where: { id_parent: 1 },
      });
      expect(result).toBe(parent);
    });

    it('should return null if access token is invalid or expired', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });
      const result = await authService.verifyAccessTokenParent('invalid_token');

      expect(result).toBeNull();
    });
  });

  // Test for verifyRefreshTokenParent
  describe('verifyRefreshTokenParent', () => {
    it('should return a parent if refresh token is valid and not expired', async () => {
      const parent: Parent = {
        id_parent: 1,
        refresh_token: 'valid_refresh_token',
        refresh_token_expires_at: new Date(Date.now() + 1000 * 3600),
      } as Parent;
      mockJwtService.verify.mockReturnValue({ sub: 1 });
      mockParentRepository.findOne.mockResolvedValue(parent);

      const result = await authService.verifyRefreshTokenParent(
        'valid_refresh_token',
      );

      expect(mockJwtService.verify).toHaveBeenCalledWith(
        'valid_refresh_token',
        { secret: process.env.JWT_SECRET },
      );
      expect(mockParentRepository.findOne).toHaveBeenCalledWith({
        where: { id_parent: 1 },
      });
      expect(result).toBe(parent);
    });

    it('should return null if refresh token is invalid or expired', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });
      const result =
        await authService.verifyRefreshTokenParent('invalid_token');

      expect(result).toBeNull();
    });
  });

  // Test for validateParent
  describe('validateParent', () => {
    it('should return parent if credentials are valid', async () => {
      const parent: Parent = {
        email: 'parent@test.com',
        password: 'hashed_password',
      } as unknown as Parent;
      mockParentRepository.findOne.mockResolvedValue(parent);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateParent(
        'parent@test.com',
        'password',
      );

      expect(mockParentRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'parent@test.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', parent.password);
      expect(result).toBe(parent);
    });

    it('should return null if credentials are invalid', async () => {
      mockParentRepository.findOne.mockResolvedValue(null);
      const result = await authService.validateParent(
        'parent@test.com',
        'password',
      );

      expect(result).toBeNull();
    });
  });

  // Test for loginParent
  describe('loginParent', () => {
    it('should return a parent if login is successful', async () => {
      const loginDto = { email: 'parent@test.com', password: 'password' };
      const parent: Parent = {
        email: 'parent@test.com',
        password: 'hashed_password',
      } as unknown as Parent;
      mockParentRepository.findOne.mockResolvedValue(parent);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.loginParent(loginDto);

      expect(mockParentRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'parent@test.com' },
      });
      expect(result).toEqual({ bool: true, parent });
    });

    it('should throw UnauthorizedException if login fails', async () => {
      const loginDto = { email: 'parent@test.com', password: 'wrong_password' };
      mockParentRepository.findOne.mockResolvedValue(null);

      await expect(authService.loginParent(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      const loginDto = { email: 'parent@test.com', password: 'password' };
      mockParentRepository.findOne.mockImplementation(() => {
        throw new Error();
      });

      await expect(authService.loginParent(loginDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
