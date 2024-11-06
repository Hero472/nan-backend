import { IsEnum, IsInt, IsNumber, Max, Min } from 'class-validator';
import { LevelEnum } from '../../enum';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateGradeDto {

  @PrimaryGeneratedColumn()
  id_grade!: number;

  @IsInt()
  id_student!: number;

  @IsInt()
  id_subject!: number;

  @IsNumber()
  @Min(1)
  @Max(7)
  grade!: number;

  @IsEnum(LevelEnum)
  level!: LevelEnum;

  @IsInt()
  @Min(2000)
  @Max(3000)
  year!: number;
}
