import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
    
    @ApiProperty({
        description: 'Original Password of the User',
        example: 'abc123'
    })
    @IsString()
    @IsNotEmpty()
    oldPassword: string;
    
    @ApiProperty({
        description: 'New Password of the User',
        example: 'xyz123'
    })
    @IsString()
    @IsNotEmpty()
    newPassword: string;

}