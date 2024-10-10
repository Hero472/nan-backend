import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { UserSend, UserType } from '../types';
import * as bcrypt from 'bcrypt';
import { Parent } from 'src/parent/entities/parent.entity';
import { LevelEnum } from 'src/enum';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Injectable()
export class StudentService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly mailService: MailService,
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<UserSend> {
    const { name, email, password, id_parent } = createStudentDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const parent = await this.parentRepository.findOne({
        where: { id_parent: id_parent },
      });

      if (!parent) {
        throw new NotFoundException('Parent not found for student');
      }

      const student: Student = this.studentRepository.create({
        name,
        email,
        level: LevelEnum.Level1,
        password: Buffer.from(hashedPassword),
        parent: parent,
      });

      const result = await this.studentRepository.save(student);

      return {
        name: result.name,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        user_type: UserType.Student,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while saving the Student',
      );
    }
  }

  findAll() {
    return this.studentRepository.find();
  }

  async findOne(access_token: string): Promise<UserSend> {
    const decodedToken = this.jwtService.verify(access_token);
    const studentId = decodedToken.sub;
    const studentEmail = decodedToken.email;

    try {
      const student = await this.studentRepository.findOne({
        where: { id_student: studentId },
        relations: ['parent'],
      });

      if (!student) {
        throw new NotFoundException(
          `Student with email ${studentEmail} not found`,
        );
      }

      return {
        name: student.name,
        access_token: student.access_token,
        refresh_token: student.refresh_token,
        user_type: UserType.Student,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while fetching the Student',
      );
    }
  }

  async initiatePasswordRecovery(email: string): Promise<{message: string}> {
    try {
      const student = await this.studentRepository.findOne({
        where: { email },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      const recoveryCode = Math.random().toString(36).substring(2, 8); // Generate a 6-character code
      const expiresAt = new Date(Date.now() + 3600 * 1000); // Expires in 1 hour

      student.recovery_code = recoveryCode;
      student.recovery_code_expires_at = expiresAt;

      await this.studentRepository.save(student);

      await this.mailService.sendRecoveryEmail(student.email, recoveryCode);

      return { message: 'Recovery email sent' };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error ocurred while iniciating password recovery',
      );
    }
  }

  async verifyRecoveryCode(email: string, code: string): Promise<{message: string}> {
    const student = await this.studentRepository.findOne({
      where: { email, recovery_code: code },
    });

    if (!student || !student.recovery_code_expires_at || student.recovery_code_expires_at < new Date()) {
      throw new BadRequestException('Invalid or expired recovery code');
    }

    return { message: 'Code verified, proceed to reset password' };
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<{message: string}> {
    try {
      const student = await this.studentRepository.findOne({
        where: { email, recovery_code: code },
      });

      if (!student || !student.recovery_code_expires_at || student.recovery_code_expires_at < new Date()) {
        throw new BadRequestException('Invalid or expired recovery code');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      student.password = Buffer.from(hashedPassword);
      student.recovery_code = null;
      student.recovery_code_expires_at = null;

      await this.studentRepository.save(student);

      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while resetting the password',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  async update(
    access_token: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<UserSend> {
    try {
      const decodedToken = this.jwtService.verify(access_token);
      const studentId = decodedToken.sub;

      const student = await this.studentRepository.findOne({
        where: { id_student: studentId },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      const { name, email, password } = updateStudentDto;

      if (name) {
        student.name = name;
      }

      if (email) {
        student.email = email;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        student.password = Buffer.from(hashedPassword);
      }

      const result = await this.studentRepository.save(student);

      return {
        name: result.name,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        user_type: UserType.Student
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while updating the student',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  async remove(token: string): Promise<UserSend> {
    try {
      const decodedToken = this.jwtService.verify(token);
      const studentId = decodedToken.sub;
      const studentEmail = decodedToken.email;
      const student: Student | null = await this.studentRepository.findOne({ where: { id_student: studentId } });

      if (!student) {
        throw new NotFoundException(`Student with email ${studentEmail} not found`);
      }

      await this.studentRepository.remove(student);

      return {
        name: student.name,
        access_token: student.access_token,
        refresh_token: student.refresh_token,
        user_type: UserType.Student
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException;
      }

      throw new InternalServerErrorException('An error occurred while removing the student');
    }
  }
}
