import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthenticateDto {

    @ApiProperty({
        description: 'Enter users Email',
        example: 'example@email.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Password in plain text',
        example: 'abc123',
    })
    @IsNotEmpty()
    @IsString()
    password: string;

}