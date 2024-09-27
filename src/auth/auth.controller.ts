import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Student } from 'src/student/entities/student.entity';
import { Parent } from 'src/parent/entities/parent.entity';
import { Professor } from 'src/professor/entities/professor.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string; userType: 'student' | 'parent' | 'professor' }) {
    const { email, password, userType } = loginDto;
    let bool: boolean;
    let user: Student | Parent | Professor;

    // Handle login based on userType
    switch (userType) {
      case 'student':
        ({ bool, student: user } = await this.authService.loginStudent({ email, password }));
        break;
      case 'parent':
        ({ bool, parent: user } = await this.authService.loginParent({ email, password }));
        break;
      case 'professor':
        ({ bool, professor: user } = await this.authService.loginProfessor({ email, password }));
        break;
      default:
        throw new BadRequestException('Invalid user type');
    }

    if (!bool) {
      throw new UnauthorizedException('Invalid email or password');
    }

    let accessToken: string;
    let refreshToken: string;

    // Generate tokens based on userType
    switch (userType) {
      case 'student':
        accessToken = await this.authService.generateAccessTokenStudent(user as Student);
        refreshToken = await this.authService.generateRefreshTokenStudent(user as Student);
        await this.authService.updateStudentTokens(user as Student, accessToken, refreshToken);
        break;
      case 'parent':
        accessToken = await this.authService.generateAccessTokenParent(user as Parent);
        refreshToken = await this.authService.generateRefreshTokenParent(user as Parent);
        await this.authService.updateParentTokens(user as Parent, accessToken, refreshToken);
        break;
      case 'professor':
        accessToken = await this.authService.generateAccessTokenProfessor(user as Professor);
        refreshToken = await this.authService.generateRefreshTokenProfessor(user as Professor);
        await this.authService.updateProfessorTokens(user as Professor, accessToken, refreshToken);
        break;
    }

    return { accessToken, refreshToken };
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string; userType: 'student' | 'parent' | 'professor' }) {
    const { refreshToken, userType } = body;
    let user: Student | Parent | Professor | null;

    // Verify refresh token based on userType
    switch (userType) {
      case 'student':
        user = await this.authService.verifyRefreshTokenStudent(refreshToken);
        break;
      case 'parent':
        user = await this.authService.verifyRefreshTokenParent(refreshToken);
        break;
      case 'professor':
        user = await this.authService.verifyRefreshTokenProfessor(refreshToken);
        break;
      default:
        throw new BadRequestException('Invalid user type');
    }

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    let newAccessToken: string;
    let newRefreshToken: string;

    // Generate new tokens based on userType
    switch (userType) {
      case 'student':
        newAccessToken = await this.authService.generateAccessTokenStudent(user as Student);
        newRefreshToken = await this.authService.generateRefreshTokenStudent(user as Student);
        await this.authService.updateStudentTokens(user as Student, newAccessToken, newRefreshToken);
        break;
      case 'parent':
        newAccessToken = await this.authService.generateAccessTokenParent(user as Parent);
        newRefreshToken = await this.authService.generateRefreshTokenParent(user as Parent);
        await this.authService.updateParentTokens(user as Parent, newAccessToken, newRefreshToken);
        break;
      case 'professor':
        newAccessToken = await this.authService.generateAccessTokenProfessor(user as Professor);
        newRefreshToken = await this.authService.generateRefreshTokenProfessor(user as Professor);
        await this.authService.updateProfessorTokens(user as Professor, newAccessToken, newRefreshToken);
        break;
    }

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}

