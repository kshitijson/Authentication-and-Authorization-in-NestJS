import { Body, Controller, Get, Headers, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticateDto } from 'src/auth/dto/authenticate.dto';
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    @HttpCode(200)
    @ApiOperation({ summary: 'Authenticates the user' })
    @ApiOkResponse({ description: 'Login Successfull' })
    @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
    async authenticate(@Body() authenticateDto: AuthenticateDto) {
        return this.authService.authenticate(authenticateDto);
    }

    @Get('refresh')
    async regenerateToken(@Headers() headers: { refresh: string }) {
        if (!headers.refresh) return { message: 'Please send Refresh Token' };
        return await this.authService.regenerateToken(headers);
    }
}
