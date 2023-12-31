import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import { ShareButton } from '../../../components/ShareButton';

import { TopNav } from '@/components/TopNav';
import { BackIcon } from '@/components/icons/BackIcon';
import { InfoIcon } from '@/components/icons/InfoIcon';
import { getCard } from '@/services/cardService';
import { createSharing } from '@/services/shareService';

export default async function Page({ params }: { params: { id: string } }) {
    const { card } = await getCard(params.id);
    if (!card) {
        notFound();
    }

    const getSharingData = async () => {
        'use server';
        return await createSharing(params.id);
    };

    const backBtn = (
        <Link href="/">
            <BackIcon />
        </Link>
    );

    const btnPanel = (
        <div className="flex gap-2">
            <ShareButton getSharingData={getSharingData} />
            <Link href={`/cards/detail/${params.id}`}>
                <InfoIcon />
            </Link>
        </div>
    );

    return (
        <div className="w-96 min-h-screen p-4 grid grid-rows-[auto_1fr] gap-10">
            <TopNav left={backBtn} right={btnPanel} />
            <div className="justify-self-center flex flex-col gap-10">
                <div className="w-80 h-52 overflow-hidden rounded-3xl border border-primary-400">
                    <img
                        srcSet={card?.image_front || 'https://placehold.co/600x400?text=Error'}
                        alt="placeholder"
                        className="w-full h-full object-cover object-center"
                    />
                </div>
                {card?.image_back && (
                    <div className="w-80 h-52 overflow-hidden rounded-3xl border border-primary-400">
                        <img
                            srcSet={card.image_back || 'https://placehold.co/600x400?text=Error'}
                            alt="placeholder"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
