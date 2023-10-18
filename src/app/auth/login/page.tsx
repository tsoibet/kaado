import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { LoginForm } from './LoginForm';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Page() {
    const session = await getServerSession(authOptions);
    if (session) {
        redirect('/');
    }

    return (
        <div className="w-96 min-h-screen p-4 flex flex-col items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-2">
                <p className="text-4xl">Welcome to</p>
                <p className="text-4xl">KAADO</p>
            </div>
            <LoginForm />
            <div className="flex flex-col items-center gap-1">
                <p>Don&apos;t have an account?</p>
                <Link href="/auth/register">
                    <p className="text-sm text-info-600 underline">Sign up</p>
                </Link>
            </div>
        </div>
    );
}
