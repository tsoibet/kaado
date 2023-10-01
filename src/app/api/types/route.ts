import { NextResponse } from 'next/server';

import { createErrorResponse } from '@/lib/utils';
import { createType, getTypes } from '@/services/typeService';

export async function GET() {
    try {
        const { types, error } = await getTypes();

        if (error) {
            throw error;
        }

        let json_response = {
            status: 'success',
            types,
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
            return createErrorResponse('Type must have a name', 400);
        }

        const { type, error } = await createType(body.name, body.isDefault);
        if (error) {
            throw error;
        }

        let json_response = {
            status: 'success',
            data: {
                type,
            },
        };
        return new NextResponse(JSON.stringify(json_response), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return createErrorResponse('Type with title already exists', 409);
        }

        return createErrorResponse(error.message, 500);
    }
}
