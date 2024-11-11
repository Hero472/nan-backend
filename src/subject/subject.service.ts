import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Professor } from '../professor/entities/professor.entity';
import { StudentSubjectSendIdStudent, StudentSubjectSendIdSubject, SubjectSend } from '../types';
import { Student } from 'src/student/entities/student.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<SubjectSend> {
    const { id_professor, ...subjectData } = createSubjectDto;
    try {
      const professor = await this.professorRepository.findOne({
        where: { id_professor },
      });
      if (!professor) {
        throw new NotFoundException(
          `Professor with id ${id_professor} not found`,
        );
      }

      const subject = this.subjectRepository.create({
        ...subjectData,
        professor: professor,
      });

      const savedSubject = await this.subjectRepository.save(subject);

      const subjectSend: SubjectSend = {
        id_subject: savedSubject.id_subject,
        name: savedSubject.name,
        level: savedSubject.level,
        day: savedSubject.day,
        block: savedSubject.block,
      };

      return subjectSend;
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  }

  async findAll(): Promise<SubjectSend[]> {
    const subjects: Subject[] = await this.subjectRepository.find();

    const subjectSends: SubjectSend[] = subjects.map((subject) => ({
      id_subject: subject.id_subject,
      name: subject.name,
      level: subject.level,
      day: subject.day,
      block: subject.block,
    }));

    return subjectSends;
  }

  async findOne(id_subject: number): Promise<SubjectSend> {
    const subject = await this.subjectRepository.findOne({
      where: { id_subject },
    });
    if (!subject) {
      throw new NotFoundException(`Subject with id ${id_subject} not found`);
    }

    const subjectSend: SubjectSend = {
      id_subject: subject.id_subject,
      name: subject.name,
      level: subject.level,
      day: subject.day,
      block: subject.block,
    };

    return subjectSend;
  }

  async getStudentSubjectIdSubject(
    id_subject: number,
  ): Promise<StudentSubjectSendIdSubject[]> {

    const subject = await this.subjectRepository.findOne({
      where: { id_subject },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with id ${id_subject} not found`);
    }

    const students = await this.studentRepository
      .createQueryBuilder('student')
      .where('student.level = :level', { level: subject.level })
      .select(['student.id_student', 'student.name'])
      .getMany();

    if (!students.length) {
      throw new NotFoundException(
        `No students found for subject with id ${id_subject} at level ${subject.level}`,
      );
    }

    const result: StudentSubjectSendIdSubject[] = students.map((student) => ({
      id_student: student.id_student,
      name: student.name,
    }));

    return result;
  }

  async getStudentSubjectIdStudent(
    id_student: number,
  ): Promise<StudentSubjectSendIdStudent[]> {
    const student = await this.studentRepository.findOne({
      where: { id_student },
    });
  
    if (!student) {
      throw new NotFoundException(`Student with id ${id_student} not found`);
    }
  
    const subjects = await this.subjectRepository
      .createQueryBuilder('subject')
      .where('subject.level = :level', { level: student.level })
      .select(['subject.id_subject', 'subject.name'])
      .getMany();
  
    if (!subjects.length) {
      throw new NotFoundException(
        `No subjects found for student with id ${id_student} at level ${student.level}`,
      );
    }
  
    const result: StudentSubjectSendIdStudent[] = subjects.map((subject) => ({
      id_subject: subject.id_subject,
      name: subject.name,
    }));
  
    return result;
  }

  async update(
    id_subject: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectSend> {
    const subject = await this.subjectRepository.findOne({
      where: { id_subject },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with id ${id_subject} not found`);
    }

    if (updateSubjectDto.name !== undefined) {
      subject.name = updateSubjectDto.name;
    }

    if (updateSubjectDto.level !== undefined) {
      subject.level = updateSubjectDto.level;
    }

    if (updateSubjectDto.day !== undefined) {
      subject.day = updateSubjectDto.day;
    }

    if (updateSubjectDto.block !== undefined) {
      subject.block = updateSubjectDto.block;
    }

    const subjectNew = await this.subjectRepository.save(subject);

    const subjectSend: SubjectSend = {
      id_subject: subjectNew.id_subject,
      name: subjectNew.name,
      level: subjectNew.level,
      day: subjectNew.day,
      block: subjectNew.block,
    };

    return subjectSend;
  }

  async remove(id_subject: number): Promise<SubjectSend> {
    const subject: Subject | null = await this.subjectRepository.findOne({
      where: { id_subject: id_subject },
    });

    if (!subject) {
      throw new NotFoundException(`Subject not found`);
    }

    const result = await this.subjectRepository.delete(id_subject);

    if (result.affected === 0) {
      throw new NotFoundException(`Subject with id ${id_subject} not found`);
    }

    const subjectSend: SubjectSend = {
      id_subject: subject.id_subject,
      name: subject.name,
      level: subject.level,
      day: subject.day,
      block: subject.block,
    };

    return subjectSend;
  }
}
