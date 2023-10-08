import { withAuth } from 'next-auth/middleware';

// middleware is applied to all routes, use conditionals to select

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            return !!token;
        },
    },
});

export const config = { matcher: ['/((?!api/auth/|auth/|favicon.ico).*)'] };
