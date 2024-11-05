import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { Parent } from './entities/parent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentSendFromParent, UserSend, UserType } from '../types';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ParentService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Parent)
    private readonly parentRepository: Repository<Parent>,
    private readonly mailService: MailService,
  ) {}

  async create(createParentDto: CreateParentDto): Promise<UserSend> {
    const { name, email, password } = createParentDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const parent = this.parentRepository.create({
      name,
      email,
      password: Buffer.from(hashedPassword),
    });

    try {
      const result = await this.parentRepository.save(parent);

      return {
        id: parent.id_parent,
        name: result.name,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        user_type: UserType.Parent,
      };
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        'An error occurred while saving the parent',
      );
    }
  }

  findAll() {
    return this.parentRepository.find();
  }

  async findOne(access_token: string): Promise<UserSend> {
    try {
      const decodedToken = this.jwtService.verify(access_token, {
        secret: process.env.JWT_SECRET,
      });
      const parentId = decodedToken.sub;
      const parentEmail = decodedToken.email;

      const parent = await this.parentRepository.findOne({
        where: { id_parent: parentId },
        relations: ['students'],
      });

      if (!parent) {
        throw new NotFoundException(
          `parent with email ${parentEmail} not found`,
        );
      }

      return {
        id: parent.id_parent,
        name: parent.name,
        access_token: parent.access_token,
        refresh_token: parent.refresh_token,
        user_type: UserType.Parent,
      };
    } catch (error: unknown) {
      console.error('Error during parent fetch:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while fetching the parent',
      );
    }
  }

  async initiatePasswordRecovery(email: string) {
    const parent = await this.parentRepository.findOne({ where: { email } });

    if (!parent) {
      throw new NotFoundException('parent not found');
    }

    const recoveryCode = Math.random().toString(36).substring(2, 8); // Generate a 6-character code
    const expiresAt = new Date(Date.now() + 3600 * 1000); // Expires in 1 hour

    parent.recovery_code = recoveryCode;
    parent.recovery_code_expires_at = expiresAt;

    await this.parentRepository.save(parent);

    await this.mailService.sendRecoveryEmail(parent.email, recoveryCode);

    return { message: 'Recovery email sent' };
  }

  async verifyRecoveryCode(email: string, code: string) {
    const parent = await this.parentRepository.findOne({
      where: { email, recovery_code: code },
    });

    if (
      !parent ||
      !parent.recovery_code_expires_at ||
      parent.recovery_code_expires_at < new Date()
    ) {
      throw new BadRequestException('Invalid or expired recovery code');
    }

    return { message: 'Code verified, proceed to reset password' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const parent = await this.parentRepository.findOne({
      where: { email, recovery_code: code },
    });

    if (
      !parent ||
      !parent.recovery_code_expires_at ||
      parent.recovery_code_expires_at < new Date()
    ) {
      throw new BadRequestException('Invalid or expired recovery code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    parent.password = Buffer.from(hashedPassword);
    parent.recovery_code = null; // Clear recovery code after successful reset
    parent.recovery_code_expires_at = null;

    await this.parentRepository.save(parent);

    return { message: 'Password reset successfully' };
  }

  async getStudents(access_token: string): Promise<StudentSendFromParent[]> {
    try {
      const decodedToken = this.jwtService.verify(access_token, {
        secret: process.env.JWT_SECRET,
      });
      const parentId = decodedToken.sub;

      const parent = await this.parentRepository.findOne({
        where: { id_parent: parentId },
        relations: ['students'],
      });

      if (!parent) {
        throw new Error('Parent not found');
      }

      const result: StudentSendFromParent[] = parent.students.map(student => ({
        name: student.name,
        level: student.level,
      }));
  
      return result;

    } catch(error: unknown) {
      throw error;
    }
  }

  async update(
    id: number,
    updateParentDto: UpdateParentDto,
  ): Promise<UserSend> {
    try {
      const parent = await this.parentRepository.findOne({
        where: { id_parent: id },
      });

      if (!parent) {
        throw new NotFoundException(`parent with ID ${id} not found`);
      }

      const { name, email, password } = updateParentDto;

      if (name) {
        parent.name = name;
      }

      if (email) {
        parent.email = email;
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        parent.password = Buffer.from(hashedPassword);
      }

      const result = await this.parentRepository.save(parent);

      return {
        id: parent.id_parent,
        name: result.name,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        user_type: UserType.Parent,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while updating the parent',
      );
    }
  }

  async remove(id: number): Promise<UserSend> {
    try {
      const parent: Parent | null = await this.parentRepository.findOne({
        where: { id_parent: id },
        relations: ['students'],
      });

      if (!parent) {
        throw new NotFoundException(`Parent not found`);
      }

      if (parent.students.length > 0) {
        throw new BadRequestException(
          `Cannot remove parent with associated students`,
        );
      }

      await this.parentRepository.remove(parent);

      return {
        id: parent.id_parent,
        name: parent.name,
        access_token: parent.access_token,
        refresh_token: parent.refresh_token,
        user_type: UserType.Parent,
      };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      }

      if (error instanceof BadRequestException) {
        throw new NotFoundException();
      }

      throw new InternalServerErrorException(
        'An error occurred while removing the parent',
      );
    }
  }
}
