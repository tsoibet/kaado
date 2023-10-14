import { revalidatePath } from 'next/cache';

import { Form } from './form';

import { createType } from '@/services/typeService';

export default async function Page() {
    const createNewType = async (name: string) => {
        'use server';
        const { type, error } = await createType(name);
        if (type) {
            revalidatePath('/type');
        }
        return { type, error };
    };
    return (
        <div className="w-96 min-h-screen p-4 grid grid-rows-[auto_1fr] gap-4">
            <Form createNewType={createNewType} />
        </div>
    );
}
