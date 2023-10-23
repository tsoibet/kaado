import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

import { DeleteButton } from './DeleteButton';

import { ShareButton } from '@/components/ShareButton';
import { TopNav } from '@/components/TopNav';
import { BackIcon } from '@/components/icons/BackIcon';
import { deleteCard, getCard } from '@/services/cardService';
import { createSharing } from '@/services/shareService';
import { getType } from '@/services/typeService';

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
        <Link href={`/cards/${params.id}`}>
            <BackIcon />
        </Link>
    );

    const btnPanel = (
        <div className="flex gap-2">
            <ShareButton getSharingData={getSharingData} />
        </div>
    );

    const { type } = await getType(card.type);
    let typeName = type?.name || 'Error loading card type';

    const handleDelete = async () => {
        'use server';

        const { result, error } = await deleteCard(params.id);
        if (result) {
            revalidatePath('/');
        }
        return { card: result, error };
    };

    return (
        <div className="w-96 min-h-screen p-4 grid grid-rows-[auto_1fr] gap-10">
            <TopNav left={backBtn} right={btnPanel} />
            <div className="w-full justify-self-center flex flex-col items-center gap-5">
                <div className="w-10/12 flex flex-col items-center gap-1">
                    <div className="w-36 h-24 overflow-hidden rounded-xl border">
                        <img
                            srcSet={card?.image_front || 'https://placehold.co/600x400?text=Error'}
                            alt="placeholder"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                    <div className="text-2xl">{card.name}</div>
                    <div className="text-sm">{typeName}</div>
                </div>
                {card.number && (
                    <div className="w-10/12 flex flex-col gap-1">
                        <div className="text-xs self-start">CARD NUMBER</div>
                        <div className="p-2 rounded-xl border">{card.number}</div>
                    </div>
                )}
                {card.note && (
                    <div className="w-10/12 flex flex-col gap-1">
                        <div className="text-xs self-start">NOTE</div>
                        <div className="p-2 rounded-xl border">{card.note}</div>
                    </div>
                )}
                <div className="w-10/12 mt-4 flex flex-col gap-1">
                    <Link href={`/cards/edit/${params.id}`}>
                        <div className="p-2 text-info-600 text-center rounded-xl border">
                            Edit Card
                        </div>
                    </Link>
                    <DeleteButton title="Remove Card" handleDelete={handleDelete} />
                </div>
            </div>
        </div>
    );
}
