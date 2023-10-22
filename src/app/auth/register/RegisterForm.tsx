'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ChangeEvent, useState } from 'react';

import { UserBasicInfo } from '@/services/userService';

export function RegisterForm({
    register,
}: {
    register: (
        username: string,
        password: string
    ) => Promise<{ user?: UserBasicInfo | undefined; error?: string }>;
}) {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        username: '',
        password: '',
        confirm: '',
    });
    const [errorMsg, setErrorMsg] = useState('');

    const router = useRouter();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        if (formValues.password !== formValues.confirm) {
            setErrorMsg('Passwords do not match.');
            setLoading(false);
            return;
        }
        try {
            const { error } = await register(formValues.username, formValues.password);

            if (error) {
                setLoading(false);
                setErrorMsg(error);
                return;
            }

            const res = await signIn('credentials', {
                redirect: false,
                username: formValues.username,
                password: formValues.password,
            });

            if (res && !res.error) {
                router.replace('/');
            } else {
                setErrorMsg(
                    'Created account, but failed to login. Please visit sign in page to sign in.'
                );
            }
        } catch (error: any) {
            setLoading(false);
            setErrorMsg('Failed to register.');
            console.log(error);
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    return (
        <form onSubmit={handleSubmit} className="w-10/12 flex flex-col items-center gap-4">
            <div className="w-full flex flex-col gap-1">
                <label htmlFor="username" className="text-xs self-start">
                    USERNAME
                </label>
                <input
                    required
                    id="username"
                    name="username"
                    type="text"
                    minLength={4}
                    maxLength={20}
                    value={formValues.username}
                    onChange={handleChange}
                    disabled={loading}
                    className="py-1 px-3 rounded-lg border border-primary-600"
                />
                <p className="text-xs text-primary-400 self-end">4 ~ 20 characters</p>
            </div>
            <div className="w-full flex flex-col gap-1">
                <label htmlFor="password" className="text-xs self-start">
                    PASSWORD
                </label>
                <input
                    required
                    id="password"
                    name="password"
                    type="password"
                    minLength={8}
                    maxLength={20}
                    value={formValues.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="off"
                    className="py-1 px-3 rounded-lg border border-primary-600"
                />
                <p className="text-xs text-primary-400 self-end">8 ~ 20 characters</p>
            </div>
            <div className="w-full flex flex-col gap-1">
                <label htmlFor="password" className="text-xs self-start">
                    CONFIRM PASSWORD
                </label>
                <input
                    required
                    id="confirm"
                    name="confirm"
                    type="password"
                    minLength={8}
                    maxLength={20}
                    value={formValues.confirm}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="off"
                    className="py-1 px-3 rounded-lg border border-primary-600"
                />
            </div>
            <div className="w-full flex flex-col items-center gap-1">
                <p className="h-4 text-xs text-danger-600">{errorMsg}</p>
                <button
                    type="submit"
                    className={`w-full py-1.5 px-3 rounded-lg bg-primary-800 text-primary-50 ${
                        loading && 'bg-primary-400'
                    }`}
                    disabled={loading}
                >
                    Sign up
                </button>
            </div>
        </form>
    );
}
