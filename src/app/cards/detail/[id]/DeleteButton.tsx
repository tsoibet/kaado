'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ICard } from '@/models/Card';

export function DeleteButton({
    title,
    handleDelete,
}: {
    title: string;
    handleDelete: () => Promise<{ card?: ICard; error?: any }>;
}) {
    const router = useRouter();

    const [errorMsg, setErrorMsg] = useState('');

    const onClickHandler = async () => {
        try {
            const isConfirm = window.confirm('This card will be deleted.');
            if (!isConfirm) {
                return;
            }
            const { error } = await handleDelete();
            if (error) {
                setErrorMsg(error);
                return;
            }
            router.replace('/');
        } catch (error: any) {
            setErrorMsg(error);
        }
    };

    return (
        <>
            <div
                className="p-2 text-danger-600 text-center rounded-xl border cursor-pointer"
                onClick={onClickHandler}
            >
                {title}
            </div>
            {errorMsg && <div className="text-sm text-danger-600 text-center">{errorMsg}</div>}
        </>
    );
}
