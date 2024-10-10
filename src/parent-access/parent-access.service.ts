
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { Grade } from './entities/grade.entity';  // Assuming grade entity exists

@Injectable()
export class ParentAccessService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
  ) {}

  async getDocumentsByStudent(studentId: number) {
    return this.documentRepository.find({ where: { student: studentId } });
  }

  async getGradesByStudent(studentId: number) {
    return this.gradeRepository.find({ where: { student: studentId } });
  }

  downloadDocument(documentId: number) {
    return this.documentRepository.findOne(documentId);
  }
}
