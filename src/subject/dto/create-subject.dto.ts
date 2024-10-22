import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
import { BlockEnum, DayEnum, LevelEnum } from "../../enum";

export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEnum(LevelEnum)
  level!: LevelEnum;

  @IsNotEmpty()
  @IsEnum(DayEnum)
  day!: DayEnum;

  @IsNotEmpty()
  @IsEnum(BlockEnum)
  block!: BlockEnum;

  @IsNotEmpty()
  @IsInt()
  id_professor!: number;
}
