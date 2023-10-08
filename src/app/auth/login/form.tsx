'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ChangeEvent, useState } from 'react';

export const LoginForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        username: '',
        password: '',
    });
    const [errorMsg, setErrorMsg] = useState('');

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/member';

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setFormValues({ username: '', password: '' });

            const res = await signIn('credentials', {
                redirect: false,
                username: formValues.username,
                password: formValues.password,
                callbackUrl,
            });

            setLoading(false);

            if (!res?.error) {
                router.push(callbackUrl);
            } else {
                setErrorMsg('invalid username or password');
            }
        } catch (error: any) {
            setLoading(false);
            setErrorMsg(error);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    return (
        <form onSubmit={onSubmit}>
            {errorMsg && <p className="text-center bg-danger-300">{errorMsg}</p>}
            <div>
                <input
                    required
                    name="username"
                    value={formValues.username}
                    onChange={handleChange}
                    placeholder="username"
                />
            </div>
            <div>
                <input
                    required
                    type="password"
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
            </div>
            <button
                type="submit"
                className={`${loading ? 'bg-primary-600' : 'bg-info-600'} text-primary-50`}
                disabled={loading}
            >
                {loading ? 'loading...' : 'Sign In'}
            </button>
        </form>
    );
};
