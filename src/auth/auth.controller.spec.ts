import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
    updateTokens: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return accessToken and refreshToken for valid credentials', async () => {
      const loginDto = { email: 'test@test.com', password: 'password' };
      const student = { id_student: 1, email: 'test@test.com' };

      mockAuthService.login.mockResolvedValue({ bool: true, student });
      mockAuthService.generateAccessToken.mockResolvedValue('access-token');
      mockAuthService.generateRefreshToken.mockResolvedValue('refresh-token');

      const result = await authController.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(mockAuthService.generateAccessToken).toHaveBeenCalledWith(student);
      expect(mockAuthService.generateRefreshToken).toHaveBeenCalledWith(student);
      expect(mockAuthService.updateTokens).toHaveBeenCalledWith(student, 'access-token', 'refresh-token');
      expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = { email: 'wrong@test.com', password: 'wrongPassword' };

      mockAuthService.login.mockResolvedValue({ bool: false, student: null });

      await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refresh', () => {
    it('should return new accessToken and refreshToken when refreshToken is valid', async () => {
      const refreshToken = 'valid-refresh-token';
      const student = { id_student: 1, email: 'test@test.com' };

      mockAuthService.verifyRefreshToken.mockResolvedValue(student);
      mockAuthService.generateAccessToken.mockResolvedValue('new-access-token');
      mockAuthService.generateRefreshToken.mockResolvedValue('new-refresh-token');

      const result = await authController.refresh(refreshToken);

      expect(mockAuthService.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(mockAuthService.generateAccessToken).toHaveBeenCalledWith(student);
      expect(mockAuthService.generateRefreshToken).toHaveBeenCalledWith(student);
      expect(mockAuthService.updateTokens).toHaveBeenCalledWith(student, 'new-access-token', 'new-refresh-token');
      expect(result).toEqual({ accessToken: 'new-access-token', refreshToken: 'new-refresh-token' });
    });

    it('should throw UnauthorizedException when refreshToken is invalid', async () => {
      const refreshToken = 'invalid-refresh-token';

      mockAuthService.verifyRefreshToken.mockResolvedValue(null);

      await expect(authController.refresh(refreshToken)).rejects.toThrow(UnauthorizedException);

      expect(mockAuthService.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
    });
  });

});
