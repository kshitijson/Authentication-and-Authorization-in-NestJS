import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

// dotenv.config({ path: __dirname + '../../../.env' });
dotenv.config();

const authToken = (userId: string): string => {
    const accessToken = jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN as jwt.Secret,
    );
    return accessToken;
};

const authenticate = (token: string): string | null => {
    try {
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN as jwt.Secret,
        ) as { userId: string };
        return decoded.userId;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export { authToken, authenticate };
