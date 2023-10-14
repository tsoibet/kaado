import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

import { Form } from './form';

import { deleteType, getType, updateType } from '@/services/typeService';

export default async function Page({ params }: { params: { id: string } }) {
    const { type, error } = await getType(params.id);

    const editType = async (name: string) => {
        'use server';
        const { type: updatedType, error: updateError } = await updateType(params.id, { name });
        if (updatedType) {
            revalidatePath('/type');
        }
        return { type: updatedType, error: updateError };
    };

    const removeType = async () => {
        'use server';
        const { result: deletedType, error: updateError } = await deleteType(params.id);
        if (deletedType) {
            revalidatePath('/type');
        }
        return { type: deletedType, error: updateError };
    };

    if (!type) {
        notFound();
    }
    return (
        <div className="w-96 min-h-screen p-4 grid grid-rows-[auto_1fr] gap-4">
            {error && <div>{error}</div>}
            <Form name={type.name} editType={editType} removeType={removeType} />
        </div>
    );
}
