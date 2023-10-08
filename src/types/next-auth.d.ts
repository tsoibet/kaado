// eslint-disable-next-line unused-imports/no-unused-imports
import NextAuth from 'next-auth';
import { JWT as DefaultToken } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultToken {
        userId: string;
    }
}
