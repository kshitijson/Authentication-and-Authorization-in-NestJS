import { Injectable } from '@nestjs/common';
import { authenticate, authToken } from './utils/token';

@Injectable()
export class UsersService {
    private userInfo = {
        name: 'Kshitij',
        password: 'abc123',
    };

    private posts = [
        {
            id: 1,
            author: 'Kshitij',
            blog: 'My name is Kshitij',
        },
        {
            id: 2,
            author: 'Harsh',
            blog: 'My name is Harsh',
        },
        {
            id: 3,
            author: 'Kshitij',
            blog: 'I like to watch anime',
        },
    ];

    login(user: { name: string; password: string }) {
        if (
            user.name === this.userInfo.name &&
            user.password === this.userInfo.password
        ) {
            return {
                ...user,
                jwt: authToken(user.name),
            };
        }

        return {
            ...user,
            jwt: 'Not valid',
        };
    }

    viewBlog(headers: { token: string }) {
        const jwtToken: string = headers.token;

        const user: string | null = authenticate(jwtToken);
        if (!user) return { message: 'Your Session Expired, Please Login' };

        return this.posts.filter((post) => post.author === user);
    }
}
