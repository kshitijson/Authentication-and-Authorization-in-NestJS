import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { authenticate, authToken } from './utils/token';
import db from 'src/db/db_connect';
import { postsSchema, roleSchema, userSchema } from 'src/db/schema';
import { and, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserDto } from './dto/user.dto';
import { PostDto } from './dto/post.dto';
import { ChangePasswordDto } from './dto/password.dto';
dotenv.config();

@Injectable()
export class UsersService {

    constructor(
        private jwtService: JwtService
    ) {}

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

    async verifyToken(token: string) {
        try {
            // Verifies the token and handles the expiration error
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.ACCESS_TOKEN,
            });
            return payload;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async register(userDto: UserDto) {

        // check if user already exists
        const fetchUser = await db.select().from(userSchema).where(
            eq(
                userSchema.email, userDto.email
            )
        );

        if (fetchUser.length > 0) {
            throw new HttpException(
                {
                    status: HttpStatus.CONFLICT,
                    error: "User Already Exists",
                },
                HttpStatus.CONFLICT
            );
        };
        //

        // if not insert new user
        await db.insert(userSchema).values({
            email: userDto.email,
            password: userDto.password,
            name: userDto.name,    
        });

        // fetch the id of the new inserted user
        let newUser = await db.select({id: userSchema.id}).from(userSchema).where(
            eq(
                userSchema.email, userDto.email
            )
        )
        
        console.log(newUser);
        // insert into the role table
        await db.insert(roleSchema).values({
            user_id: newUser[0].id,
            role: userDto.role,
        })

        return { message: "Registered Sucessfully" };
        
    }

    async changePassword(headers: { token: string }, changePasswordDto: ChangePasswordDto) {

        try {
            
            let payload = await this.verifyToken(headers.token);

            const fetchedUser = await db.select().from(userSchema).where(eq(payload.sub, userSchema.id));
            if (fetchedUser.length < 1) return { message: "User does not exist" };

            if (fetchedUser[0].password != changePasswordDto.oldPassword) {
                throw new HttpException(HttpStatus.BAD_REQUEST);
            }

            db.update(userSchema).set({ password: changePasswordDto.newPassword }).where(
                eq(
                    userSchema.id,
                    payload.sub
                )
            )

            return { message: "Password Updated Successfully" }

        } catch (err) {
            // Token Expiration Error
            if (err instanceof TokenExpiredError) {

                throw new HttpException(
                    {
                        status: HttpStatus.UNAUTHORIZED,
                        error: "Token has expired",
                    },
                    HttpStatus.UNAUTHORIZED
                );
            }
            // Invalid Token Error
            else if (err instanceof JsonWebTokenError) {
                throw new HttpException(
                    {
                        status: HttpStatus.UNAUTHORIZED,
                        error: "Invalid Token",
                    },
                    HttpStatus.UNAUTHORIZED
                );
            }
            // Blog already exists error
            else if (err instanceof HttpException) {
                throw new HttpException(
                    {
                        status: HttpStatus.CONFLICT,
                        error: "A Blog with this Title already exists",
                    },
                    HttpStatus.CONFLICT
                );
            }
            // Some other error as internal server error
            else {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: "An Error Occured",
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }

    }

    async createPost(headers: { token: string }, postDto: PostDto) {
        try {
            // Try to verify the access token first
            let payload = await this.verifyToken(headers.token);
            console.log(payload);
    
            /* if (!payload) {
                return { message: "Token Expired" };
            } */
    
            // If the token is valid, proceed to fetch user and create post
            const fetchedUser = await db.select().from(userSchema).where(eq(payload.sub, userSchema.id));
            if (fetchedUser.length < 1) return { message: "User does not exist" };

            let fetchedPost = await db.select().from(postsSchema).where(
                and(
                    eq(postsSchema.title, postDto.title),
                    eq(postsSchema.author_id, payload.sub)
                )
            );

            console.log(fetchedPost)

            if (fetchedPost.length > 0) {
                throw new HttpException(
                    {
                        status: HttpStatus.CONFLICT,
                        error: "A Blog with this Title already exists",
                    },
                    HttpStatus.CONFLICT
                );
            }
    
            // Proceed to create post
            const newPost = await db.insert(postsSchema).values({
                author_id: payload.sub,
                title: postDto.title,
                blog: postDto.blog,
            });
            return { message: "Post added successfully" };
        } catch (err) {
            console.log(err);
    
            // Token Expiration Error
            if (err instanceof TokenExpiredError) {

                throw new HttpException(
                    {
                        status: HttpStatus.UNAUTHORIZED,
                        error: "Token has expired",
                    },
                    HttpStatus.UNAUTHORIZED
                );
            }
            // Invalid Token Error
            else if (err instanceof JsonWebTokenError) {
                throw new HttpException(
                    {
                        status: HttpStatus.UNAUTHORIZED,
                        error: "Invalid Token",
                    },
                    HttpStatus.UNAUTHORIZED
                );
            }
            // Blog already exists error
            else if (err instanceof HttpException) {
                throw new HttpException(
                    {
                        status: HttpStatus.CONFLICT,
                        error: "A Blog with this Title already exists",
                    },
                    HttpStatus.CONFLICT
                );
            }
            // Some other error as internal server error
            else {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: "An Error Occured",
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
            
            
        }
    }

    async viewBlog(headers: { token: string }) {
        // const jwtToken: string = headers.token;

        // const user: string | null = authenticate(jwtToken);
        // if (!user) return { message: 'Your Session Expired, Please Login' };
        
        // return this.posts.filter((post) => post.author === user);

        try {
            // Try to verify the access token first
            let payload = await this.verifyToken(headers.token);
            console.log(payload);
    
            if (!payload) {
                return { message: "Token Expired" };
            }
    
            // If the token is valid, proceed to fetch user and create post
            const fetchedUser = await db.select().from(userSchema).where(eq(payload.sub, userSchema.id));
            if (fetchedUser.length < 1) return { message: "User does not exist" };
    
            if (payload.role === "Admin") {
                return await db.select().from(postsSchema);
            }
            else if (payload.role === "user") {
                return await db.select().from(postsSchema).where(eq(postsSchema.author_id, payload.sub));
            }
        } catch (err) {
            console.log(err);
    
            // Handle token expiration and try to refresh
            if (err instanceof TokenExpiredError) {
                // Try to verify the refresh token if the access token expired
                return { message: "Token is Expired" };
            }
    
            return { message: "Error", error: err };
        }

    }
    
    getBlog(headers: { token: string }, id: string) {
        const jwtToken: string = headers.token;
    
        const user: string | null = authenticate(jwtToken);
        if (!user) return { message: 'Your Session Expired, Please Login' };

        const desiredPost = this.posts.find((post) => post.id === parseInt(id) && user === post.author);
        if (!desiredPost) return { message: "You are not authorized to view this post" }
        return { desiredPost };
    }
}
