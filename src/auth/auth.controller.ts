import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Student } from '../student/entities/student.entity';
import { Parent } from '../parent/entities/parent.entity';
import { Professor } from '../professor/entities/professor.entity';
import { UserType } from '../types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string; userType: UserType }): Promise<{accessToken: string, refreshToken: string }> {
    const { email, password, userType } = loginDto;
    let bool: boolean;
    let user: Student | Parent | Professor | null = null;

    switch (userType) {
      case UserType.Student:
        ({ bool, student: user } = await this.authService.loginStudent({ email, password }));
        break;
      case UserType.Parent:
        ({ bool, parent: user } = await this.authService.loginParent({ email, password }));
        break;
      case UserType.Professor:
        ({ bool, professor: user } = await this.authService.loginProfessor({ email, password }));
        break;
      default:
        throw new BadRequestException('Invalid user type');
    }

    if (!bool || !user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    let accessToken: string = '';
  let refreshToken: string = '';

    switch (userType) {
      case UserType.Student:
        accessToken = await this.authService.generateAccessTokenStudent(user as Student);
        refreshToken = await this.authService.generateRefreshTokenStudent(user as Student);
        await this.authService.updateStudentTokens(user as Student, accessToken, refreshToken);
        break;
      case UserType.Parent:
        accessToken = await this.authService.generateAccessTokenParent(user as Parent);
        refreshToken = await this.authService.generateRefreshTokenParent(user as Parent);
        await this.authService.updateParentTokens(user as Parent, accessToken, refreshToken);
        break;
      case UserType.Professor:
        accessToken = await this.authService.generateAccessTokenProfessor(user as Professor);
        refreshToken = await this.authService.generateRefreshTokenProfessor(user as Professor);
        await this.authService.updateProfessorTokens(user as Professor, accessToken, refreshToken);
        break;
    }

    return { accessToken, refreshToken };
  }

  @Post('refresh')
async refresh(
  @Body() body: { refreshToken: string; userType: UserType }
): Promise<{ accessToken: string; refreshToken: string }> {
  const { refreshToken, userType } = body;
  let user: Student | Parent | Professor | null;

  switch (userType) {
    case UserType.Student:
      user = await this.authService.verifyRefreshTokenStudent(refreshToken);
      break;
    case UserType.Parent:
      user = await this.authService.verifyRefreshTokenParent(refreshToken);
      break;
    case UserType.Professor:
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

  switch (userType) {
    case UserType.Student:
      newAccessToken = await this.authService.generateAccessTokenStudent(user as Student);
      newRefreshToken = await this.authService.generateRefreshTokenStudent(user as Student);
      await this.authService.updateStudentTokens(user as Student, newAccessToken, newRefreshToken);
      break;
    case UserType.Parent:
      newAccessToken = await this.authService.generateAccessTokenParent(user as Parent);
      newRefreshToken = await this.authService.generateRefreshTokenParent(user as Parent);
      await this.authService.updateParentTokens(user as Parent, newAccessToken, newRefreshToken);
      break;
    case UserType.Professor:
      newAccessToken = await this.authService.generateAccessTokenProfessor(user as Professor);
      newRefreshToken = await this.authService.generateRefreshTokenProfessor(user as Professor);
      await this.authService.updateProfessorTokens(user as Professor, newAccessToken, newRefreshToken);
      break;
  }

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
}

