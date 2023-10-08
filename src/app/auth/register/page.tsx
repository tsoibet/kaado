import Link from 'next/link';

import { RegisterForm } from './form';

import { createUser } from '@/services/userService';

export default async function Page() {
    const register = async (username: string, password: string) => {
        'use server';
        return await createUser(username, password);
    };
    return (
        <>
            <RegisterForm register={register} />
            <Link href="/auth/login">
                <div>Sign in page</div>
            </Link>
        </>
    );
}
