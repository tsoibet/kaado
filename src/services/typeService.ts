'use server';
import connectDB from '../lib/dbConnect';
import { stringToObjectId } from '../lib/utils';

import TypeModel, { IType } from '@/models/Type';

export async function getTypes() {
    try {
        await connectDB();

        // TODO: Get USER_ID from session
        const user = stringToObjectId('123456789012');

        if (!user) {
            return { error: 'user not found' };
        }

        const types = await TypeModel.find<IType>({ user });

        return {
            types,
        };
    } catch (error) {
        return { error };
    }
}

export async function createType(name: string, isDefault = false) {
    try {
        await connectDB();
        // TODO: Get USER_ID from session
        const user = stringToObjectId('123456789012');

        if (!user) {
            return { error: 'user not found' };
        }

        const type: IType = await TypeModel.create({ name, user, isDefault });

        return {
            type,
        };
    } catch (error) {
        return { error };
    }
}

export async function getType(id: string) {
    try {
        await connectDB();
        // TODO: Get USER_ID from session
        const user = stringToObjectId('123456789012');

        if (!user) {
            return { error: 'user not found' };
        }

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: 'Type not found' };
        }
        const type = await TypeModel.findOne<IType>({ _id: parsedId, user });
        if (type) {
            return {
                type,
            };
        } else {
            return { error: 'Type not found' };
        }
    } catch (error) {
        return { error };
    }
}

export async function updateType(id: string, { name }: { name?: string }) {
    try {
        await connectDB();
        // TODO: Get USER_ID from session
        const user = stringToObjectId('123456789012');

        if (!user) {
            return { error: 'user not found' };
        }

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: 'Type not found' };
        }

        const type = await TypeModel.findOneAndUpdate<IType>(
            { _id: parsedId, user },
            { name },
            { new: true }
        );

        if (type) {
            return {
                type,
            };
        } else {
            return { error: 'Type not found' };
        }
    } catch (error) {
        return { error };
    }
}

export async function deleteType(id: string) {
    try {
        await connectDB();
        // TODO: Get USER_ID from session
        const user = stringToObjectId('123456789012');

        if (!user) {
            return { error: 'user not found' };
        }

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: 'Type not found' };
        }
        const type = await TypeModel.findById<IType>(parsedId);
        if (type) {
            if (!user.equals(type.user)) {
                return { error: 'Unauthorized action' }
            }
            if (type.isDefault) {
                return { error: 'Cannot delete default type' }
            }
            const result = await type.deleteOne()
            return { result };
        } else {
            return { error: 'Type not found' };
        }
    } catch (error) {
        return { error: 'Deletion failed' };
    }
}
