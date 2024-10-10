
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  createSurvey(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveyService.createSurvey(createSurveyDto);
  }

  @Get()
  findAllSurveys() {
    return this.surveyService.findAllSurveys();
  }

  @Get(':id')
  findSurveyById(@Param('id') id: number) {
    return this.surveyService.findSurveyById(id);
  }

  @Post(':surveyId/question/:questionId/response')
  submitResponse(
    @Param('surveyId') surveyId: number,
    @Param('questionId') questionId: number,
    @Body('response') response: string,
  ) {
    return this.surveyService.submitResponse(surveyId, questionId, response);
  }
}
