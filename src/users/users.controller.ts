import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('login')
    login(@Body() user: { name: string; password: string }) {
        return this.usersService.login(user);
    }

    @Get('blog')
    viewBlog(@Headers() headers: { token: string }) {
        if (!headers.token) return { message: 'Please Login' };
        return this.usersService.viewBlog(headers);
    }
}
