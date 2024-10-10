
import { Controller, Post, Body } from '@nestjs/common';
import { AIService } from './ai.service';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('recommendations')
  getStudyRecommendations(@Body() studentData: any) {
    return this.aiService.getStudyRecommendations(studentData);
  }
}
