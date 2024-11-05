import { IsEnum, IsInt, IsNumber, Max, Min } from 'class-validator';
import { LevelEnum } from 'src/enum';

export class CreateGradeDto {
  @IsInt()
  studentId!: number;

  @IsInt()
  subjectId!: number;

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
