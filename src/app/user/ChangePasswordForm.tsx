'use client';

import { ChangeEvent, useState } from 'react';

import { UserBasicInfo } from '@/services/userService';

export function ChangePasswordForm({
    updatePassword,
}: {
    updatePassword: (
        oldPassword: string,
        newPassword: string
    ) => Promise<{ user?: UserBasicInfo | undefined; error?: string }>;
}) {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        oldPassword: '',
        newPassword: '',
        confirm: '',
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);
        setSuccessMsg('');
        if (formValues.newPassword !== formValues.confirm) {
            setErrorMsg('Passwords do not match.');
            setLoading(false);
            return;
        }
        try {
            const { error } = await updatePassword(formValues.oldPassword, formValues.newPassword);

            if (error) {
                setLoading(false);
                setErrorMsg(error);
                return;
            }

            setFormValues({
                oldPassword: '',
                newPassword: '',
                confirm: '',
            });
            setLoading(false);
            setErrorMsg('');
            setSuccessMsg('Updated password!');
        } catch (error: any) {
            setLoading(false);
            setErrorMsg('Failed to change password.');
            console.log(error);
        }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            <div className="w-full flex flex-col gap-1">
                <label htmlFor="oldPassword" className="text-xs self-start">
                    OLD PASSWORD
                </label>
                <input
                    required
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    minLength={8}
                    maxLength={20}
                    value={formValues.oldPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="py-1 px-3 rounded-lg border border-primary-600"
                />
            </div>
            <div className="w-full flex flex-col gap-1">
                <label htmlFor="password" className="text-xs self-start">
                    NEW PASSWORD
                </label>
                <input
                    required
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    minLength={8}
                    maxLength={20}
                    value={formValues.newPassword}
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
                <div className="h-4">
                    <p className="text-xs text-danger-600">{errorMsg}</p>
                    <p className="text-xs text-info-600">{successMsg}</p>
                </div>
                <button
                    type="submit"
                    className={`w-full py-1.5 px-3 rounded-lg bg-primary-800 text-primary-50 ${
                        loading && 'bg-primary-400'
                    }`}
                    disabled={loading}
                >
                    Change Password
                </button>
            </div>
        </form>
    );
}
