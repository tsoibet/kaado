import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import { AcceptButton } from './AcceptButton';

import { TopNav } from '@/components/TopNav';
import { BackIcon } from '@/components/icons/BackIcon';
import { executeSharing, fetchSharing } from '@/services/shareService';

export default async function Page({ params }: { params: { id: string } }) {
    const { sharing } = await fetchSharing(params.id);
    if (!sharing) {
        notFound();
    }

    const backBtn = (
        <Link href={`/`}>
            <BackIcon />
        </Link>
    );

    const handleAccept = async () => {
        'use server';
        return await executeSharing(params.id);
    };

    return (
        <div className="w-96 min-h-screen p-4 grid grid-rows-[auto_1fr] gap-10">
            <TopNav left={backBtn} />
            <div className="w-10/12 justify-self-center flex flex-col items-center gap-5">
                <div className="text-xl text-center">
                    {sharing.user.name} <br />
                    has shared a card with you
                </div>
                <div className="w-36 h-24 overflow-hidden rounded-xl border">
                    <Image
                        src={sharing.card.image_front}
                        alt="placeholder"
                        className="w-full h-full object-cover object-center"
                        width="476"
                        height="300"
                    />
                </div>
                <div className="w-full">
                    <AcceptButton title="Accept Card" handleAccept={handleAccept} />
                </div>
            </div>
        </div>
    );
}
