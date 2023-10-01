import { NextResponse } from 'next/server';

import { createErrorResponse } from '@/lib/utils';
import { updateType, getType, deleteType } from '@/services/typeService';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        if (!id) {
            return createErrorResponse(`Type doesn't exist`, 404);
        }
        const { type, error } = await getType(id);

        if (error) {
            throw error;
        }

        let json_response = {
            status: 'success',
            type,
        };
        return NextResponse.json(json_response);
    } catch (error: any) {
        return createErrorResponse(error.message, 500);
    }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        if (!id) {
            return createErrorResponse(`Type doesn't exist`, 404);
        }
        const body = await request.json();

        if (!body.name) {
            return createErrorResponse('Type must have a name', 400);
        }

        const { type, error } = await updateType(id, { name: body.name });
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
            status: 202,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return createErrorResponse('Type with title already exists', 409);
        }

        return createErrorResponse(error.message, 500);
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        if (!id) {
            return createErrorResponse(`Type doesn't exist`, 404);
        }

        const { error } = await deleteType(id);
        if (error) {
            throw error;
        }

        let json_response = {
            status: 'success',
        };
        return new NextResponse(JSON.stringify(json_response), {
            status: 202,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return createErrorResponse(error.message, 500);
    }
}
