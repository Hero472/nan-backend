import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateParentDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsNotEmpty()
    password!: string;

    @IsString()
    notification_id?: string;
}
