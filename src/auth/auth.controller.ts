import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const { bool, student } = await this.authService.login(loginDto);
    if (!bool) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.authService.generateAccessToken(student);
    const refreshToken = await this.authService.generateRefreshToken(student);

    await this.authService.updateTokens(student, accessToken, refreshToken);

    return { accessToken, refreshToken };
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    const student = await this.authService.verifyRefreshToken(refreshToken);

    if (!student) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = await this.authService.generateAccessToken(student);
    const newRefreshToken = await this.authService.generateRefreshToken(student);

    await this.authService.updateTokens(student, newAccessToken, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
