import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateCalendarDto {

    @IsNotEmpty()
    @IsString()
    title!: string;

    @IsNotEmpty()
    @IsDate()
    start!: Date;

    @IsNotEmpty()
    @IsDate()
    end!: Date;

    @IsString()
    description!: string;

}
