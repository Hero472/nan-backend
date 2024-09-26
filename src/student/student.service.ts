import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { UserSend } from '../types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto) : Promise<UserSend> {

    const {name, email, password } = createStudentDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const Student = this.studentRepository.create({
      name,
      email,
      password: Buffer.from(hashedPassword)
    })

    try {
      const result = await this.studentRepository.save(Student);

      return {
        id_user: result.id_student,
        name: result.name,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        user_type: "Student"
      };

    } catch (error: unknown) {
      throw new InternalServerErrorException('An error occurred while saving the Student');
    }
  }

  findAll() {
    return `This action returns all student`;
  }

  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
