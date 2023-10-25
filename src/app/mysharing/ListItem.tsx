'use client';
import Image from 'next/image';
import { useState } from 'react';

import { TrashBinIcon } from '@/components/icons/TrashBinIcon';
import { SharingInfo } from '@/services/shareService';

interface ListItemProps {
    sharing: SharingInfo;
    handleDelete: (id: string) => Promise<string | undefined>;
}

export function ListItem({ sharing, handleDelete }: ListItemProps) {
    const [errorMsg, setErrorMsg] = useState('');
    const deleteSharing = async (id: string) => {
        const error = await handleDelete(id);
        if (error) {
            setErrorMsg(error);
        }
    };

    return (
        <div className="border -mt-px">
            <div className="flex justify-between mx-5 my-3 ">
                <div className="flex">
                    <Image src={sharing.card.image_front} alt="card image" width="79" height="50" />
                    <div className="ml-2 text-xs">
                        <div className="font-semibold">Created at {sharing.created_at} </div>
                        <div className="text-primary-400">Valid until {sharing.valid_until} </div>
                        {errorMsg && <div className="text-danger-600">{errorMsg}</div>}
                    </div>
                </div>
                <button onClick={() => deleteSharing(sharing._id)}>
                    <TrashBinIcon />
                </button>
            </div>
            <div className="pl-5 bg-primary-200 text-xs">
                <p className="inline">{sharing.isComplete ? '✔️' : '✖️'} </p>
                <p className="inline">
                    {sharing.isComplete
                        ? `Received by ${sharing.recipient?.name ?? 'unknown'} @ ${
                              sharing.recieved_at
                          }`
                        : 'Not yet received'}{' '}
                </p>
            </div>
        </div>
    );
}
