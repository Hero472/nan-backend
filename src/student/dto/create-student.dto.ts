import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateStudentDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsNotEmpty()
    password!: string;

    @IsNotEmpty()
    id_parent!: number;
}
