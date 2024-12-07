import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateCalendarDto {
    @IsNotEmpty()
    @IsString()
    title!: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    start!: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    end!: Date;

    @IsString()
    description!: string;
}