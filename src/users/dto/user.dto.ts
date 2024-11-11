import { IsEmail, IsEnum, isNotEmpty, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class UserDto {

    @ApiProperty({
        description: 'Email of user',
        example: 'example@email.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Password in plain text',
        example: 'abc123',
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        description: 'Type of the user',
        examples: ['ADMIN', 'USER'],
    })
    @IsEnum(["ADMIN", "USER"], {
        message: 'Valid role required',
    })
    @IsNotEmpty()
    role: "ADMIN" | "USER";

    @ApiProperty({
        description: 'Name of the user',
        example: 'John doe',
    })
    @IsNotEmpty()
    @IsString()
    name: string;
    
}