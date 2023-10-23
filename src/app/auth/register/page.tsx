import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { RegisterForm } from './RegisterForm';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createUser } from '@/services/userService';

export default async function Page() {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect('/');
    }

    const register = async (username: string, password: string) => {
        'use server';
        return await createUser(username, password);
    };

    return (
        <div className="w-96 min-h-screen p-4 flex flex-col items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-2">
                <p className="text-4xl">Sign up for</p>
                <p className="text-4xl">KAADO</p>
            </div>
            <RegisterForm register={register} />
            <div className="flex flex-col items-center gap-1">
                <p>Already have an account?</p>
                <Link href="/auth/login">
                    <p className="text-sm text-info-600 underline">Sign in</p>
                </Link>
            </div>
        </div>
    );
}
