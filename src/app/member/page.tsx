import { getServerSession } from 'next-auth/next';

import SignOutBtn from './SignOutBtn';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Page() {
    const session = await getServerSession(authOptions);
    return (
        <>
            <div>Member only</div>
            <div>id: {session?.user?.id}</div>
            <div>username: {session?.user?.name}</div>
            <div>
                <SignOutBtn />
            </div>
        </>
    );
}
