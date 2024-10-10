
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SurveyQuestion } from './survey-question.entity';  // Related to questions

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => SurveyQuestion, (question) => question.survey, { cascade: true })
  questions: SurveyQuestion[];
}

@Entity()
export class SurveyQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column('simple-array')
  options: string[];  // Multiple-choice options for the question

  @Column('simple-array')
  responses: string[];  // Responses from parents

  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;
}
