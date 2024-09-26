import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Student } from '../student/entities/student.entity';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let studentRepository: Repository<Student>;

  const mockStudentRepository = {
    findOne: jest.fn(),
    update: jest.fn()
  }

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockStudentRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    (bcrypt.compare as jest.Mock).mockReset();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    studentRepository = module.get<Repository<Student>>(getRepositoryToken(Student));
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {

    it('should return student and true for valid credentials', async () => {

      const loginDto = { email: 'test@test.com', password: 'password' };
      const student = { id_student: 1, email: 'test@test.com', password: 'hashedPassword' } as unknown as Student;
      
      mockStudentRepository.findOne.mockResolvedValue(student);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(loginDto);

      expect(mockStudentRepository.findOne).toHaveBeenCalledWith({ where: { email: loginDto.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, student.password);
      expect(result).toEqual({ bool: true, student });

    });

  });

  describe('generateAccessToken', () => {
    it('should return a JWT access token', async () => {
      const student = { id_student: 1, email: 'test@test.com' } as Student;
      mockJwtService.sign.mockReturnValue('access-token');

      const token = await authService.generateAccessToken(student);

      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: student.id_student, email: student.email }, { expiresIn: '1h' });
      expect(token).toBe('access-token');
    });
  });

  describe('generateRefreshToken', () => {
    it('should return a JWT refresh token', async () => {
      const student = { id_student: 1, email: 'test@test.com' } as Student;
      mockJwtService.sign.mockReturnValue('refresh-token');

      const token = await authService.generateRefreshToken(student);

      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: student.id_student, email: student.email }, { expiresIn: '7d' });
      expect(token).toBe('refresh-token');
    });
  });

  describe('verifyAccessToken', () => {
    it('should return the student if the token is valid', async () => {
      const token = 'valid-token';
      const student = { id_student: 1, access_token_expires_at: new Date(Date.now() + 3600 * 1000) } as Student;

      mockJwtService.verify.mockReturnValue({ sub: student.id_student });
      mockStudentRepository.findOne.mockResolvedValue(student);

      const result = await authService.verifyAccessToken(token);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token, { secret: process.env.JWT_SECRET });
      expect(mockStudentRepository.findOne).toHaveBeenCalledWith({ where: { id_student: student.id_student } });
      expect(result).toEqual(student);
    });

    it('should return null if the token is expired or invalid', async () => {
      const token = 'expired-token';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });

      const result = await authService.verifyAccessToken(token);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token, { secret: process.env.JWT_SECRET });
      expect(result).toBeNull();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should return the student if the refresh token is valid', async () => {
      const token = 'valid-refresh-token';
      const student = { id_student: 1, refresh_token: 'valid-refresh-token', refresh_token_expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000) } as Student;

      mockJwtService.verify.mockReturnValue({ sub: student.id_student });
      mockStudentRepository.findOne.mockResolvedValue(student);

      const result = await authService.verifyRefreshToken(token);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token, { secret: process.env.JWT_SECRET });
      expect(mockStudentRepository.findOne).toHaveBeenCalledWith({ where: { id_student: student.id_student } });
      expect(result).toEqual(student);
    });

    it('should return null if the refresh token is invalid or expired', async () => {
      const token = 'invalid-refresh-token';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });

      const result = await authService.verifyRefreshToken(token);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token, { secret: process.env.JWT_SECRET });
      expect(result).toBeNull();
    });
  });

});
