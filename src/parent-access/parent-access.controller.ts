
import { Controller, Get, Param } from '@nestjs/common';
import { ParentAccessService } from './parent-access.service';

@Controller('parent-access')
export class ParentAccessController {
  constructor(private readonly parentAccessService: ParentAccessService) {}

  @Get('documents/:studentId')
  getDocuments(@Param('studentId') studentId: number) {
    return this.parentAccessService.getDocumentsByStudent(studentId);
  }

  @Get('grades/:studentId')
  getGrades(@Param('studentId') studentId: number) {
    return this.parentAccessService.getGradesByStudent(studentId);
  }

  @Get('download/:documentId')
  downloadDocument(@Param('documentId') documentId: number) {
    return this.parentAccessService.downloadDocument(documentId);
  }
}
