import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Student } from '../student/entities/student.entity';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>
  ) {}

  async generateAccessToken(student: Student): Promise<string> {
    const payload = { sub: student.id_student, email: student.email };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  async generateRefreshToken(student: Student): Promise<string> {
    const payload = { sub: student.id_student, email: student.email };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  async verifyAccessToken(accessToken: string): Promise<Student | null> {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });

      const student = await this.studentRepository.findOne({
        where: { id_student: payload.sub },
      });

      if (student && student.access_token_expires_at > new Date()) {
        return student;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<Student | null> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const student = await this.studentRepository.findOne({
        where: { id_student: payload.sub },
      });

      if (student && student.refresh_token === refreshToken && student.refresh_token_expires_at > new Date()) {
        return student;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async validateUser(email: string, pass: string): Promise<Student | null> {
    const student = await this.studentRepository.findOne({ where: { email } });

    if (!student) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(pass, student.password.toString());

    if (isPasswordValid) {
      return student;
    }

    return null;
  }

  async updateTokens(student: Student, accessToken: string, refreshToken: string): Promise<void> {
    await this.studentRepository.update(student.id_student, {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expires_at: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      refresh_token_expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000), // 7 days from now
    });
  }

  async login(loginDto: LoginDto): Promise<{ bool: boolean; student: Student }> {
    const { email, password } = loginDto;

    try {
      const student = await this.studentRepository.findOne({ where: { email } });

      if (!student) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, student.password.toString());

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      return { bool: true, student };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
