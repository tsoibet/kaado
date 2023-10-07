'use server';
import bcrypt from 'bcrypt';

import connectDB from '../lib/dbConnect';
import { stringToObjectId } from '../lib/utils';

import TypeModel from '@/models/Type';
import UserModel, { IUser } from '@/models/User';

export async function getUsers() {
    try {
        await connectDB();

        const users = await UserModel.find<IUser>({}, 'name');

        return {
            users,
        };
    } catch (error) {
        return { error };
    }
}

export async function createUser(name: string, password: string) {
    try {
        await connectDB();

        const hashedPassword = await bcrypt.hash(password, 10);

        const user: IUser = await UserModel.create({ name, password: hashedPassword });

        await TypeModel.create({ name: 'Default', user, isDefault: true });

        return {
            user: {
                name: user.name,
                _id: user._id,
            },
        };
    } catch (error) {
        return { error };
    }
}

export async function getUser(userID = '123456789012') {
    try {
        await connectDB();
        // TODO: Get USER_ID from session
        const userId = stringToObjectId(userID);

        if (!userId) {
            return { error: 'User not found' };
        }

        const user = await UserModel.findById<IUser>(userId, 'name');
        if (user) {
            return {
                user,
            };
        } else {
            return { error: 'User not found' };
        }
    } catch (error) {
        return { error };
    }
}

export async function authenticateUser(name: string, password: string) {
    try {
        await connectDB();

        const user = await UserModel.findOne<IUser>({ name });
        if (!user) {
            return { error: 'User not found' };
        }
        if (await bcrypt.compare(password, user.password)){
            return { result: { id: user._id, name: user.name } };
        }
        return { error: 'Authentication failed' };
    } catch (error) {
        return { error: 'Authentication failed' };
    }
}

export async function updatePassword(
    oldPassword: string,
    newPassword: string,
    userID = '123456789012'
) {
    try {
        await connectDB();
        // TODO: Get USER_ID from session
        const userId = stringToObjectId(userID);

        if (!userId) {
            return { error: 'User not found' };
        }

        const user = await UserModel.findById<IUser>(userId);
        if (!user) {
            return { error: 'User not found' };
        }
        const ok = await bcrypt.compare(oldPassword, user.password);
        if (!ok) {
            return { error: 'Wrong password' };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        const resultUser = await user.save();

        if (resultUser) {
            return {
                user: {
                    name: resultUser.name,
                    _id: resultUser._id,
                },
            };
        } else {
            return { error: 'User not found' };
        }
    } catch (error) {
        return { error };
    }
}

export async function deleteUser(password: string, userID = '123456789012') {
    try {
        await connectDB();
        // TODO: Get USER_ID from session
        const userId = stringToObjectId(userID);

        if (!userId) {
            return { error: 'user not found' };
        }

        const user = await UserModel.findById<IUser>(userId);
        if (!user) {
            return { error: 'User not found' };
        }
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return { error: 'Wrong password' };
        }
        const resultUser = await user.deleteOne();
        return {
            user: {
                name: resultUser.name,
                _id: resultUser._id,
            },
        };
    } catch (error) {
        return { error: 'Deletion failed' };
    }
}
