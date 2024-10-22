import { IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsString()
  id_subject!: string;

  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  studentIds!: string[];  // Array of student IDs from PostgreSQL
}