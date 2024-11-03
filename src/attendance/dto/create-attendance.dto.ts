import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LevelEnum } from 'src/enum';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsString()
  id_subject!: string;

  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @IsEnum(LevelEnum)
  level!: LevelEnum;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  studentIds!: string[];
}