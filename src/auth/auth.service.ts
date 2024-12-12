import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Student } from '../student/entities/student.entity';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from '../parent/entities/parent.entity';
import { Professor } from '../professor/entities/professor.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>
  ) {}

  // -------------------- STUDENT METHODS --------------------
  
  async generateAccessTokenStudent(student: Student): Promise<string> {
    const payload = { sub: student.id_student, email: student.email };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  async generateRefreshTokenStudent(student: Student): Promise<string> {
    const payload = { sub: student.id_student, email: student.email };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  async verifyAccessTokenStudent(accessToken: string): Promise<Student | null> {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });

      const student = await this.studentRepository.findOne({
        where: { id_student: payload.sub },
      });

       if (student && student.access_token_expires_at && student.access_token_expires_at > new Date()) {
      return student;
    }

      return null;
    } catch (error) {
      return null;
    }
  }

  async verifyRefreshTokenStudent(refreshToken: string): Promise<Student | null> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const student = await this.studentRepository.findOne({
        where: { id_student: payload.sub },
      });

      if (student && student.refresh_token === refreshToken && student.refresh_token_expires_at && student.refresh_token_expires_at > new Date()) {
        return student;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async validateStudent(email: string, pass: string): Promise<Student | null> {
    const student = await this.studentRepository.findOne({ where: { email: email } });

    if (!student) {
      return null;
    }

    const isPasswordValid = await bcryptjs.compare(pass, student.password.toString());

    if (isPasswordValid) {
      return student;
    }

    return null;
  }

  async updateStudentTokens(student: Student, accessToken: string, refreshToken: string): Promise<void> {
    await this.studentRepository.update(student.id_student, {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expires_at: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      refresh_token_expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000), // 7 days from now
    });
  }

  async loginStudent(loginDto: LoginDto): Promise<{ bool: boolean; student: Student }> {
    const { email, password } = loginDto;

    try {
      const student = await this.studentRepository.findOne({ where: { email: email } });

      if (!student) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcryptjs.compare(password, student.password.toString());

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


  // -------------------- PARENT METHODS --------------------

  async generateAccessTokenParent(parent: Parent): Promise<string> {
    const payload = { sub: parent.id_parent, email: parent.email };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  async generateRefreshTokenParent(parent: Parent): Promise<string> {
    const payload = { sub: parent.id_parent, email: parent.email };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  async verifyAccessTokenParent(accessToken: string): Promise<Parent | null> {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });

      const parent = await this.parentRepository.findOne({
        where: { id_parent: payload.sub },
      });

      if (parent && parent.access_token_expires_at && parent.access_token_expires_at > new Date()) {
        return parent;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async verifyRefreshTokenParent(refreshToken: string): Promise<Parent | null> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const parent = await this.parentRepository.findOne({
        where: { id_parent: payload.sub },
      });

      if (parent && parent.refresh_token === refreshToken && parent.refresh_token_expires_at && parent.refresh_token_expires_at > new Date()) {
        return parent;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async validateParent(email: string, pass: string): Promise<Parent | null> {
    const parent = await this.parentRepository.findOne({ where: { email } });

    if (!parent) {
      return null;
    }

    const isPasswordValid = await bcryptjs.compare(pass, parent.password.toString());

    if (isPasswordValid) {
      return parent;
    }

    return null;
  }

  async updateParentTokens(parent: Parent, accessToken: string, refreshToken: string): Promise<void> {
    await this.parentRepository.update(parent.id_parent, {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expires_at: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      refresh_token_expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000), // 7 days from now
    });
  }

  async loginParent(loginDto: LoginDto): Promise<{ bool: boolean; parent: Parent }> {
    const { email, password } = loginDto;

    try {
      const parent = await this.parentRepository.findOne({ where: { email: email } });

      if (!parent) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcryptjs.compare(password, parent.password.toString());

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      return { bool: true, parent };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  // -------------------- PROFESSOR METHODS --------------------

  async generateAccessTokenProfessor(professor: Professor): Promise<string> {
    const payload = { sub: professor.id_professor, email: professor.email };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  async generateRefreshTokenProfessor(professor: Professor): Promise<string> {
    const payload = { sub: professor.id_professor, email: professor.email };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  async verifyAccessTokenProfessor(accessToken: string): Promise<Professor | null> {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });

      const professor = await this.professorRepository.findOne({
        where: { id_professor: payload.sub },
      });

      if (professor && professor.access_token_expires_at && professor.access_token_expires_at > new Date()) {
        return professor;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async verifyRefreshTokenProfessor(refreshToken: string): Promise<Professor | null> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const professor = await this.professorRepository.findOne({
        where: { id_professor: payload.sub },
      });

      if (professor && professor.refresh_token === refreshToken && professor.refresh_token_expires_at && professor.refresh_token_expires_at > new Date()) {
        return professor;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async validateProfessor(email: string, pass: string): Promise<Professor | null> {
    const professor = await this.professorRepository.findOne({ where: { email: email } });

    if (!professor) {
      return null;
    }

    const isPasswordValid = await bcryptjs.compare(pass, professor.password.toString());

    if (isPasswordValid) {
      return professor;
    }

    return null;
  }

  async updateProfessorTokens(professor: Professor, accessToken: string, refreshToken: string): Promise<void> {
    await this.professorRepository.update(professor.id_professor, {
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expires_at: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      refresh_token_expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000), // 7 days from now
    });
  }

  async loginProfessor(loginDto: LoginDto): Promise<{ bool: boolean; professor: Professor }> {
    const { email, password } = loginDto;

    try {
      const professor = await this.professorRepository.findOne({ where: { email: email } });

      if (!professor) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcryptjs.compare(password, professor.password.toString());

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      return { bool: true, professor };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Internal Server Error');
    }
  }

}
