import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class PostDto {

    @ApiProperty({
        description: 'Title of the Blog',
        example: 'My first Blog',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'Content of the Blog',
        example: 'This is my First Blog, and i am very excited to share it with you',
    })
    @IsString()
    @IsNotEmpty()
    blog: string;

}