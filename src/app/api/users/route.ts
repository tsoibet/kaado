import { NextResponse } from 'next/server';

import { createErrorResponse } from '@/lib/utils';
import { createUser, deleteUser, getUsers, updatePassword } from '@/services/userService';

export async function GET() {
    try {
        const { users, error } = await getUsers();

        if (error) {
            throw error;
        }

        let json_response = {
            status: 'success',
            users,
        };
        return NextResponse.json(json_response);
    } catch (error: any) {
        return createErrorResponse(error.message, 500);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.name) {
            return createErrorResponse('User must have a name', 400);
        }
        if (!body.password) {
            return createErrorResponse('User must have a password', 400);
        }

        const { user, error } = await createUser(body.name, body.password);
        if (error) {
            throw error;
        }

        let json_response = {
            status: 'success',
            data: {
                user,
            },
        };
        return new NextResponse(JSON.stringify(json_response), {
            status: 201,
            headers: { 'Content-User': 'application/json' },
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return createErrorResponse('User with title already exists', 409);
        }

        return createErrorResponse(error.message, 500);
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        if (!body.oldPassword) {
            return createErrorResponse('User must have a old password', 400);
        }

        if (!body.newPassword) {
            return createErrorResponse('User must have a new password', 400);
        }

        const { user, error } = await updatePassword(body.oldPassword, body.newPassword, body.user);
        if (error) {
            throw error;
        }

        let json_response = {
            status: 'success',
            data: {
                user,
            },
        };
        return new NextResponse(JSON.stringify(json_response), {
            status: 201,
            headers: { 'Content-User': 'application/json' },
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return createErrorResponse('User with title already exists', 409);
        }

        return createErrorResponse(error.message, 500);
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();

        if (!body.password) {
            return createErrorResponse('User must have a password', 400);
        }

        const { user, error } = await deleteUser(body.password, body.user);
        if (error) {
            throw error;
        }

        let json_response = {
            status: 'success',
            data: {
                user,
            },
        };
        return new NextResponse(JSON.stringify(json_response), {
            status: 201,
            headers: { 'Content-User': 'application/json' },
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return createErrorResponse('User with title already exists', 409);
        }

        return createErrorResponse(error.message, 500);
    }
}
