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
import { UserSend, UserType } from '../types';
import * as bcrypt from 'bcrypt';
import { Parent } from 'src/parent/entities/parent.entity';
import { LevelEnum } from 'src/enum';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class StudentService {
  constructor(
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
        id_user: result.id_student,
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

  async findOne(id: number): Promise<Student> {
    try {
      const student = await this.studentRepository.findOne({
        where: { id_student: id },
        relations: ['parent'],
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      return student;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while fetching the Student',
      );
    }
  }

  async initiatePasswordRecovery(email: string) {
    const student = await this.studentRepository.findOne({ where: { email } });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const recoveryCode = Math.random().toString(36).substring(2, 8); // Generate a 6-character code
    const expiresAt = new Date(Date.now() + 3600 * 1000); // Expires in 1 hour

    student.recovery_code = recoveryCode;
    student.recovery_code_expires_at = expiresAt;

    await this.studentRepository.save(student);

    // Send recovery email
    await this.mailService.sendRecoveryEmail(student.email, recoveryCode);

    return { message: 'Recovery email sent' };
  }

  async verifyRecoveryCode(email: string, code: string) {
    const student = await this.studentRepository.findOne({ where: { email, recovery_code: code } });

    if (!student || student.recovery_code_expires_at < new Date()) {
      throw new BadRequestException('Invalid or expired recovery code');
    }

    return { message: 'Code verified, proceed to reset password' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const student = await this.studentRepository.findOne({ where: { email, recovery_code: code } });

    if (!student || student.recovery_code_expires_at < new Date()) {
      throw new BadRequestException('Invalid or expired recovery code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = Buffer.from(hashedPassword);
    student.recovery_code = null; // Clear recovery code after successful reset
    student.recovery_code_expires_at = null;

    await this.studentRepository.save(student);

    return { message: 'Password reset successfully' };
  }

}
