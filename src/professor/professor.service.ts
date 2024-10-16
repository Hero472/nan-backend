import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { Professor } from './entities/professor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { UserSend, UserType } from '../types';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProfessorService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    private readonly mailService: MailService,
  ) {}

  async create(createProfessorDto: CreateProfessorDto): Promise<UserSend> {
    const { name, email, password } = createProfessorDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const professor = this.professorRepository.create({
      name,
      email,
      password: Buffer.from(hashedPassword),
    });

    try {
      const result = await this.professorRepository.save(professor);

      return {
        name: result.name,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        user_type: UserType.Professor,
      };
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        'An error occurred while saving the professor',
      );
    }
  }

  findAll() {
    return this.professorRepository.find();
  }

  async findOne(access_token: string): Promise<UserSend> {
    try {
      const decodedToken = this.jwtService.verify(access_token);
      const professorId = decodedToken.sub;
      const professorEmail = decodedToken.email;
      const professor = await this.professorRepository.findOne({
        where: { id_professor: professorId },
      });

      if (!professor) {
        throw new NotFoundException(`professor with email ${professorEmail} not found`);
      }

      return {
        name: professor.name,
        access_token: professor.access_token,
        refresh_token: professor.refresh_token,
        user_type: UserType.Professor,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while fetching the professor',
      );
    }
  }

  async initiatePasswordRecovery(email: string) {
    const professor = await this.professorRepository.findOne({
      where: { email },
    });

    if (!professor) {
      throw new NotFoundException('professor not found');
    }

    const recoveryCode = Math.random().toString(36).substring(2, 8); // Generate a 6-character code
    const expiresAt = new Date(Date.now() + 3600 * 1000); // Expires in 1 hour

    professor.recovery_code = recoveryCode;
    professor.recovery_code_expires_at = expiresAt;

    await this.professorRepository.save(professor);

    // Send recovery email
    await this.mailService.sendRecoveryEmail(professor.email, recoveryCode);

    return { message: 'Recovery email sent' };
  }

  async verifyRecoveryCode(email: string, code: string) {
    const professor = await this.professorRepository.findOne({
      where: { email, recovery_code: code },
    });

    if (!professor ||!professor.recovery_code_expires_at || professor.recovery_code_expires_at < new Date()) {
      throw new BadRequestException('Invalid or expired recovery code');
    }

    return { message: 'Code verified, proceed to reset password' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const professor = await this.professorRepository.findOne({
      where: { email, recovery_code: code },
    });

    if (!professor || !professor.recovery_code_expires_at || professor.recovery_code_expires_at < new Date()) {
      throw new BadRequestException('Invalid or expired recovery code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    professor.password = Buffer.from(hashedPassword);
    professor.recovery_code = null;
    professor.recovery_code_expires_at = null;

    await this.professorRepository.save(professor);

    return { message: 'Password reset successfully' };
  }

  @UseGuards(JwtAuthGuard)
  async update(
    access_token: string,
    updateProfessorDto: UpdateProfessorDto,
  ): Promise<UserSend> {
    try {
      const decodedToken = this.jwtService.verify(access_token);
      const professorId = decodedToken.sub;

      const professor = await this.professorRepository.findOne({
        where: { id_professor: professorId },
      });

      if (!professor) {
        throw new NotFoundException(`professor with ID ${professorId} not found`);
      }

      const { name, email, password } = updateProfessorDto;

      if (name) {
        professor.name = name;
      }

      if (email) {
        professor.email = email;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        professor.password = Buffer.from(hashedPassword);
      }

      const result = await this.professorRepository.save(professor);

      return {
        name: result.name,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        user_type: UserType.Professor
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while updating the professor',
      );
    }
  }

  async remove(id: number): Promise<UserSend> {
    try {
      const professor: Professor | null = await this.professorRepository.findOne({ where: { id_professor: id } });

      if (!professor) {
        throw new NotFoundException(`professor not found`);
      }

      await this.professorRepository.remove(professor);

      return {
        name: professor.name,
        access_token: professor.access_token,
        refresh_token: professor.refresh_token,
        user_type: UserType.Student
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`An error occurred while removing the professor`);
    }
  }
}
