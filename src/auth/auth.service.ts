import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import db from 'src/db/db_connect';
import { roleSchema, userSchema } from 'src/db/schema';
import { and, eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import { AuthenticateDto } from 'src/auth/dto/authenticate.dto';
dotenv.config();

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ) {}

    async authenticate(authenticateDto: AuthenticateDto) {
        const fetchedUser = await db.select().from(userSchema).where(and(eq(userSchema.email, authenticateDto.email), (eq(userSchema.password, authenticateDto.password))));
        console.log(fetchedUser[0])
        
        if (fetchedUser.length > 0) {
            let userRole = await db.select({role: roleSchema.role}).from(roleSchema).where(
                eq(
                    roleSchema.user_id,
                    fetchedUser[0].id
                )
            )
            const payload = { 
                sub: fetchedUser[0].id, 
                email: fetchedUser[0].email,
                role: userRole[0].role
            };
            return {
                token: await this.jwtService.signAsync(payload),
                refresh: await this.jwtService.signAsync(payload, {
                    secret: process.env.REFRESH_TOKEN,
                    expiresIn: '7d',
                }),
            };
        }


        throw new HttpException(
            {
                status: HttpStatus.UNAUTHORIZED,
                error: "Invalid Credentials",
            },
            HttpStatus.UNAUTHORIZED
        );
    }

    async verifyRefreshToken(token: string) {
        try {
            // Verifies the token and handles the expiration error
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.REFRESH_TOKEN,
            });
            return payload;
        } catch (err) {
            throw err;
        }
    }

    async regenerateToken(headers: { refresh: string }) {
        
        try {
            let refreshPayload = await this.verifyRefreshToken(headers.refresh);

            console.log(refreshPayload);

            const payload = {
                sub: refreshPayload.sub,
                email: refreshPayload.email,
                role: refreshPayload.role
            };

            return {
                token: await this.jwtService.signAsync(payload),
                refresh: await this.jwtService.signAsync(payload, {
                    secret: process.env.REFRESH_TOKEN,
                    expiresIn: '7d',
                }),
            };
        } catch (error) {
            console.log(error)

            if (error instanceof TokenExpiredError) {
                return { message: "Please Login Again" };
            }
        }

        
    }
}
