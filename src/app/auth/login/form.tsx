'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ChangeEvent, useState } from 'react';

export function Form() {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState<{ username: string; password: string }>({
        username: '',
        password: '',
    });
    const [errorMsg, setErrorMsg] = useState('');

    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        try {
            setLoading(true);
            const res = await signIn('credentials', {
                redirect: false,
                username: formValues.username,
                password: formValues.password,
                callbackUrl,
            });
            setLoading(false);

            if (res && !res.error) {
                router.replace(callbackUrl);
            } else {
                setErrorMsg('Username or passward is incorrect.');
            }
        } catch (error: any) {
            setLoading(false);
            setErrorMsg('Failed to login.');
            console.log(error);
        }
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    }

    return (
        <form onSubmit={handleSubmit} className="w-10/12 flex flex-col items-center gap-5">
            <div className="w-full flex flex-col gap-1">
                <label htmlFor="number" className="text-xs self-start">
                    USERNAME
                </label>
                <input
                    required
                    name="username"
                    type="text"
                    value={formValues.username}
                    onChange={handleChange}
                    disabled={loading}
                    className="py-1 px-3 rounded-lg border border-primary-600"
                />
            </div>
            <div className="w-full flex flex-col gap-1">
                <label htmlFor="number" className="text-xs self-start">
                    PASSWORD
                </label>
                <input
                    required
                    name="password"
                    type="password"
                    value={formValues.password}
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
                    className={`w-full py-1.5 px-3 rounded-lg bg-info-600 text-primary-50 ${
                        loading && 'bg-primary-400'
                    }`}
                    disabled={loading}
                >
                    Sign in
                </button>
            </div>
        </form>
    );
}
