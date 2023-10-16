import { revalidatePath } from 'next/cache';

import { Form } from './Form';

import { createCard } from '@/services/cardService';
import { getTypes } from '@/services/typeService';

export default async function Page() {
    const handleCreateCard = async ({
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

        const { card: createdCard, error } = await createCard({
            image_front,
            image_back,
            name,
            type_id,
            number,
            note,
        });
        if (createdCard) {
            revalidatePath('/');
        }
        return { id: createdCard?._id, error };
    };

    const { types } = await getTypes();

    return <Form handleCreateCard={handleCreateCard} getTypesResult={{ types }} />;
}
