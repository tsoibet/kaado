import Link from 'next/link';
import { getServerSession } from 'next-auth/next';

import { ChangePasswordForm } from './ChangePasswordForm';
import { SignOutBtn } from './SignOutBtn';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { TopNav } from '@/components/TopNav';
import { BackIcon } from '@/components/icons/BackIcon';
import { updatePassword } from '@/services/userService';

export default async function Page() {
    const session = await getServerSession(authOptions);
    const backBtn = (
        <Link href="/">
            <BackIcon />
        </Link>
    );

    return (
        <div className="w-96 min-h-screen p-4 flex flex-col gap-10">
            <TopNav left={backBtn} />
            <div className="w-full justify-self-center flex justify-center">
                <div className="w-9/12 flex flex-col items-center gap-8">
                    <p className="text-3xl">User Settings</p>
                    <div className="w-full flex flex-col gap-1">
                        <label htmlFor="username" className="text-xs self-start">
                            USERNAME
                        </label>
                        <input
                            required
                            id="username"
                            name="username"
                            type="text"
                            value={session?.user?.name}
                            disabled={true}
                            className="py-1 px-3 rounded-lg border border-primary-600 text-primary-600 bg-primary-100"
                        />
                    </div>
                    <ChangePasswordForm updatePassword={updatePassword} />
                    <SignOutBtn />
                </div>
            </div>
        </div>
    );
}
