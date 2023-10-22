'use server';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';

import connectDB from '../lib/dbConnect';
import { stringToObjectId } from '../lib/utils';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import TypeModel from '@/models/Type';
import UserModel, { IUser } from '@/models/User';

export interface UserBasicInfo {
    _id: string;
    name: string;
}

export async function getUsers(): Promise<{ users?: UserBasicInfo[]; error?: string }> {
    try {
        await connectDB();

        const users = await UserModel.find<UserBasicInfo>({}, 'name');

        return {
            users,
        };
    } catch (error) {
        console.log(error);
        return { error: 'Server error' };
    }
}

export async function createUser(
    name: string,
    password: string
): Promise<{ user?: UserBasicInfo; error?: string }> {
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
    } catch (error: any) {
        if (error.code === 11000) {
            return { error: 'Username already exists' };
        }
        console.log(error);
        return { error: 'Server error' };
    }
}

export async function getUser(): Promise<{ user?: UserBasicInfo; error?: string }> {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: 'User not found' };
        }
        const userId = stringToObjectId(session.user.id);
        if (!userId) {
            return { error: 'User not found' };
        }

        const user = await UserModel.findById<IUser>(userId, 'name');
        if (user) {
            return {
                user: {
                    name: user.name,
                    _id: user._id,
                },
            };
        } else {
            return { error: 'User not found' };
        }
    } catch (error) {
        console.log(error);
        return { error: 'Server error' };
    }
}

export async function authenticateUser(
    name: string,
    password: string
): Promise<{ user?: UserBasicInfo; error?: string }> {
    try {
        await connectDB();

        const user = await UserModel.findOne<IUser>({ name });
        if (!user) {
            return { error: 'User not found' };
        }
        if (await bcrypt.compare(password, user.password)) {
            return { user: { _id: String(user._id), name: user.name } };
        }
        return { error: 'Authentication failed' };
    } catch (error) {
        console.log(error);
        return { error: 'Server error' };
    }
}

export async function updatePassword(
    oldPassword: string,
    newPassword: string
): Promise<{ user?: UserBasicInfo; error?: string }> {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: 'User not found' };
        }
        const userId = stringToObjectId(session.user.id);
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
        console.log(error);
        return { error: 'Server error' };
    }
}

export async function deleteUser(
    password: string
): Promise<{ user?: UserBasicInfo; error?: string }> {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: 'User not found' };
        }
        const userId = stringToObjectId(session.user.id);
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
        console.log(error);
        return { error: 'Server error' };
    }
}
