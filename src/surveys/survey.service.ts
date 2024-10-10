
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './entities/survey.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
  ) {}

  async createSurvey(createSurveyDto: CreateSurveyDto) {
    const survey = this.surveyRepository.create(createSurveyDto);
    return this.surveyRepository.save(survey);
  }

  findAllSurveys() {
    return this.surveyRepository.find({ relations: ['questions'] });
  }

  findSurveyById(id: number) {
    return this.surveyRepository.findOne(id, { relations: ['questions'] });
  }

  submitResponse(surveyId: number, questionId: number, response: string) {
    return this.surveyRepository
      .createQueryBuilder()
      .relation('questions')
      .of(questionId)
      .add(response);
  }
}
