import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import type { AuthOptions } from 'next-auth';

import { authenticateUser } from '@/services/userService';

export const authOptions: AuthOptions = {
    pages: {
        signIn: '/auth/login',
    },
    providers: [
        CredentialsProvider({
            name: 'Log in',
            credentials: {
                username: { label: 'username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (typeof credentials !== 'undefined') {
                    const { user, error } = await authenticateUser(
                        credentials.username,
                        credentials.password
                    );
                    if (error || !user) {
                        return null;
                    }
                    console.log(user._id);
                    return { name: user.name, id: user._id };
                } else {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Persist the OAuth access_token to the token right after signin
            if (user) {
                token.userId = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token from a provider.
            session.user.id = token.userId;
            return session;
        },
    },
    session: { strategy: 'jwt' },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
