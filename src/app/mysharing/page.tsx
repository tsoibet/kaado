import { revalidatePath } from 'next/cache';
import React from 'react';

import { ListItem } from './ListItem';

import { TopNav } from '@/components/TopNav';
import { deleteSharing, getSharings } from '@/services/shareService';

export default async function Page() {
    const { sharings } = await getSharings();

    const handleDelete = async (id: string) => {
        'use server';
        const { error } = await deleteSharing(id);
        if (!error) {
            revalidatePath('/mysharing');
        }
        return error;
    };

    return (
        <div className="w-96 min-h-screen p-4 grid grid-rows-[auto_1fr] gap-4">
            <TopNav />
            <div className="text-center">
                <div className="text-3xl font-bold m-4">My Sharings</div>
                <div className="py-12 w-96 mx-auto text-justify">
                    {sharings &&
                        sharings.map((sharing) => (
                            <ListItem
                                key={sharing._id}
                                sharing={sharing}
                                handleDelete={handleDelete}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}
