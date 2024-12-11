import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from '../student/entities/student.entity';
import { Subject } from '../subject/entities/subject.entity';
import { GradeSend } from '../types';

@Injectable()
export class GradeService {
  constructor(
    @InjectRepository(Grade)
    private readonly gradeRepository: Repository<Grade>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async create(createGradeDto: CreateGradeDto): Promise<GradeSend> {
    const student = await this.studentRepository.findOne({
      where: { id_student: createGradeDto.id_student },
    });
    const subject = await this.subjectRepository.findOne({
      where: { id_subject: createGradeDto.id_subject },
    });

    if (!student) {
      throw new NotFoundException(
        `Student with ID ${createGradeDto.id_student} not found`,
      );
    }
    if (!subject) {
      throw new NotFoundException(
        `Subject with ID ${createGradeDto.id_subject} not found`,
      );
    }

    const grade = this.gradeRepository.create({
      grade: createGradeDto.grade,
      level: createGradeDto.level,
      year: createGradeDto.year,
      student,
      subject,
    });

    const savedGrade = await this.gradeRepository.save(grade);

    const gradeSend: GradeSend = {
      id_grade: savedGrade.id_grade,
      student_name: student.name,
      subject_name: subject.name,
      grade: savedGrade.grade,
      level: savedGrade.level,
      year: savedGrade.year,
    };

    return gradeSend;
  }

  async findAll(): Promise<GradeSend[]> {
    try {
      const savedGrades = await this.gradeRepository.find({
        relations: ['student', 'subject'],
      });

      const gradeSendList: GradeSend[] = savedGrades.map((grade) => ({
        id_grade: grade.id_grade,
        student_name: grade.student.name,
        subject_name: grade.subject.name,
        grade: grade.grade,
        level: grade.level,
        year: grade.year,
      }));

      return gradeSendList;
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        `Failed to fetch grades: ${error}`,
      );
    }
  }

  async getStudentGrades(id_student: number): Promise<GradeSend[]> {
    try {
      const student = await this.studentRepository.findOne({
        where: { id_student },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${id_student} not found`);
      }

      const grades = await this.gradeRepository.find({ where: { student } });

      const gradeSend: GradeSend[] = grades.map((grade) => ({
        id_grade: grade.id_grade,
        student_name: grade.student.name,
        subject_name: grade.subject.name,
        grade: grade.grade,
        level: grade.level,
        year: grade.year,
      }));

      return gradeSend;
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        `Failed to fetch student grades: ${error}`,
      );
    }
  }

  async findOne(id: number): Promise<GradeSend> {
    try {
      const savedGrade = await this.gradeRepository.findOne({
        where: { id_grade: id },
      });
      if (!savedGrade) {
        throw new NotFoundException(`Grade with ID ${id} not found`);
      }

      const gradeSend: GradeSend = {
        id_grade: savedGrade.id_grade,
        student_name: savedGrade.student.name,
        subject_name: savedGrade.subject.name,
        grade: savedGrade.grade,
        level: savedGrade.level,
        year: savedGrade.year,
      };

      return gradeSend;
    } catch (error: unknown) {
      throw new InternalServerErrorException(`Failed to fetch grade: ${error}`);
    }
  }

  async update(id: number, updateGradeDto: UpdateGradeDto): Promise<GradeSend> {
    try {
      const grade = await this.gradeRepository.findOne({
        where: { id_grade: id },
        relations: ['student', 'subject'],
      });
  
      if (!grade) {
        throw new NotFoundException(`Grade with ID ${id} not found`);
      }
  
      Object.assign(grade, updateGradeDto);
  
      const savedGrade = await this.gradeRepository.save(grade);
  
      const gradeSend: GradeSend = {
        id_grade: savedGrade.id_grade,
        student_name: savedGrade.student.name,
        subject_name: savedGrade.subject.name,
        grade: savedGrade.grade,
        level: savedGrade.level,
        year: savedGrade.year,
      };
  
      return gradeSend;
    } catch (error: unknown) {
      throw new InternalServerErrorException(`
        Failed to update grade: ${error instanceof Error ? error.message : error},
      `);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.gradeRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Grade with ID ${id} not found`);
      }
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        `Failed to delete grade: ${error}`,
      );
    }
  }
}
