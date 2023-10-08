import Link from 'next/link';

import { LoginForm } from './form';

export default async function Page() {
    return (
        <>
            <LoginForm />
            <Link href="/auth/register">
                <div>Sign up page</div>
            </Link>
        </>
    );
}
