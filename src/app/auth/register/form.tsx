'use client';

import { signIn } from 'next-auth/react';
import { ChangeEvent, useState } from 'react';

import { UserBasicInfo } from '@/services/userService';

export const RegisterForm = ({
    register,
}: {
    register: (
        username: string,
        password: string
    ) => Promise<{ user?: UserBasicInfo | undefined; error?: string }>;
}) => {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        username: '',
        password: '',
    });
    const [errorMsg, setErrorMsg] = useState('');

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFormValues({ username: '', password: '' });

        try {
            const { error } = await register(formValues.username, formValues.password);

            setLoading(false);
            if (error) {
                setErrorMsg(error);
                return;
            }

            signIn();
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
            {errorMsg && <p className="text-center bg-red-300 py-4 mb-6 rounded">{errorMsg}</p>}
            <div>
                <input
                    required
                    type="name"
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
                {loading ? 'loading...' : 'Sign Up'}
            </button>
        </form>
    );
};
