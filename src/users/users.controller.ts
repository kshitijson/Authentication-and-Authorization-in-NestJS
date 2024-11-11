import { Body, Controller, Get, Headers, HttpCode, HttpException, HttpStatus, Param, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PostDto } from './dto/post.dto';
import { ChangePasswordDto } from './dto/password.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    @Post('register')
    @HttpCode(201)
    @ApiOperation({ summary: 'Inserts the user data into the Database' })
    @ApiCreatedResponse({ description: 'User Registered Successfully' })
    @ApiConflictResponse({ description: 'User Already Exists' })
    async register(@Body(ValidationPipe) userDto: UserDto) {
        return await this.usersService.register(userDto);
    }

    @Post('changePassword')
    async changePassword(@Headers() headers: { token: string }, @Body(ValidationPipe) changePasswordDto: ChangePasswordDto) {
        
    }

    @Post('createPost')
    @HttpCode(201)
    @ApiOperation({ summary: 'Inserts a Post into the Database' })
    @ApiCreatedResponse({ description: 'Post added successfully' })
    @ApiUnauthorizedResponse({ description: 'Token has expired | Invalid Token | No Token found in header' })
    @ApiConflictResponse({ description: 'A Blog with this Title already exists' })
    @ApiInternalServerErrorResponse({ description: 'An Error has Occured' })
    async createPost(@Headers() headers: { token: string }, @Body(ValidationPipe) postDto: PostDto) {
        if (!headers.token) {
            throw new HttpException(
                {
                    status: HttpStatus.UNAUTHORIZED,
                    error: "No Token found in header",
                },
                HttpStatus.UNAUTHORIZED
            );
        }
        return this.usersService.createPost(headers, postDto)
    }



    @Get('blog')
    async viewBlog(@Headers() headers: { token: string, refresh: string }) {
        if (!headers.token) return { message: 'Please Login' };
        return await this.usersService.viewBlog(headers);
    }
    
    @Get('blog/:id')
    getBlog(@Headers() headers: { token: string }, @Param('id') id: string) {
        if (!headers.token) return { message: 'Please Login' };
        return this.usersService.getBlog(headers, id);
    }
}
