import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.ACCESS_TOKEN,
            signOptions: { expiresIn: '60s' }
          })
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
