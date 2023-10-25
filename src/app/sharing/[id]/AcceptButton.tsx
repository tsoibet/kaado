'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ICard } from '@/models/Card';

export function AcceptButton({
    title,
    handleAccept,
}: {
    title: string;
    handleAccept: () => Promise<{ card?: ICard; error?: any }>;
}) {
    const router = useRouter();

    const [errorMsg, setErrorMsg] = useState('');

    const onClickHandler = async () => {
        try {
            const isConfirm = window.confirm('This card will be added to your KAADO.');
            if (!isConfirm) {
                return;
            }
            const { card, error } = await handleAccept();
            if (error) {
                setErrorMsg(error);
                return;
            }
            if (card) {
                router.replace(`/cards/edit/${card._id}`);
                return;
            }
            setErrorMsg('Please try again later');
        } catch (error: any) {
            setErrorMsg('Unable to add the card');
        }
    };

    return (
        <>
            <div
                className="p-2 text-info-600 text-center rounded-xl border cursor-pointer"
                onClick={onClickHandler}
            >
                {title}
            </div>
            {errorMsg && <div className="text-sm text-danger-600 text-center">{errorMsg}</div>}
        </>
    );
}
