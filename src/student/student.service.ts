import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { GradeSend, UserSend, UserType } from '../types';
import * as bcrypt from 'bcrypt';
import { Parent } from '../parent/entities/parent.entity';
import { LevelEnum } from '../enum';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateStudentDto } from './dto/update-student.dto';

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
        id: student.id_student,
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

  async findAll() {
    return await this.studentRepository.find({
      select: ['id_student', 'name', 'level', 'email'],
    });
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
        id: student.id_student,
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

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while resetting the password',
      );
    }
  }

  async getGrades(id_student: number): Promise<GradeSend[]> {
    try {
      const student = await this.studentRepository.findOne({
        where: { id_student },
        relations: ['grades', 'grades.subject'],
      });
  
      if (!student) {
        throw new NotFoundException(`Student with id ${id_student} not found`);
      }

      const gradeSend: GradeSend[] = student.grades.map((grade) => ({
        id_grade: grade.id_grade,
        student_name: student.name,
        subject_name: grade.subject.name,
        grade: grade.grade,
        level: student.level,
        year: grade.year,
      }));
  
      return gradeSend;
    } catch (error: unknown) {
      throw new Error('Failed to retrieve grades: ' + (error as Error).message);
    }
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
    level: LevelEnum
  ): Promise<UserSend> {
    try {
      const student = await this.studentRepository.findOne({
        where: { id_student: id },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
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

      if (level) {
        student.level = level;
      }

      const result = await this.studentRepository.save(student);

      return {
        id: student.id_student,
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

  async remove(id: number): Promise<UserSend> {
    try {

      const student: Student | null = await this.studentRepository.findOne({ where: { id_student: id } });

      if (!student) {
        throw new NotFoundException(`Student not found`);
      }

      await this.studentRepository.remove(student);

      return {
        id: student.id_student,
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
