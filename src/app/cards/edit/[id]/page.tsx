import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

import { Form } from './Form';

import { getCard, updateCard } from '@/services/cardService';
import { getTypes } from '@/services/typeService';

export default async function Page({ params }: { params: { id: string } }) {
    const handleUpdateCard = async ({
        image_front,
        image_back,
        name,
        type_id,
        number,
        note,
    }: {
        image_front: string;
        image_back: string;
        name: string;
        type_id: string;
        number: string;
        note: string;
    }) => {
        'use server';

        const { card: updatedCard, error } = await updateCard(params.id, {
            image_front,
            image_back,
            name,
            type_id,
            number,
            note,
        });
        if (updatedCard) {
            revalidatePath('/');
            revalidatePath(`/cards/${params.id}`);
            revalidatePath(`/cards/detail/${params.id}`);
        }
        return { id: updatedCard?._id, error };
    };

    const { card: cardData } = await getCard(params.id);
    if (!cardData) {
        notFound();
    }
    const { types } = await getTypes();

    return (
        <Form handleUpdateCard={handleUpdateCard} cardData={cardData} getTypesResult={{ types }} />
    );
}
