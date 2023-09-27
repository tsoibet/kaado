'use client';

import Link from 'next/link';

import { PencilIcon } from '@/components/icons/PencilIcon';
import { IType } from '@/models/Type';

interface ListItemProps {
    type: IType;
}

export function ListItem({ type }: ListItemProps) {
    return (
        <div className="flex justify-between border px-5 py-3 -mt-px">
            <div>{type.name} </div>
            <Link href={`/type/${type._id}`}>
                <PencilIcon />
            </Link>
        </div>
    );
}
