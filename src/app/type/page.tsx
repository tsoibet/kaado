import Link from 'next/link';
import React from 'react';

import { ListItem } from './ListItem';

import { TopNav } from '@/components/TopNav';
import { getTypes } from '@/services/typeService';

export default async function Page() {
    const { types } = await getTypes();

    return (
        <div className="w-96 min-h-screen p-4 grid grid-rows-[auto_1fr] gap-4">
            <TopNav />
            <div className="text-center">
                <div className="text-3xl font-bold m-4">Card Types</div>
                <div className="py-12 w-52 mx-auto text-justify">
                    {types && types.map((type) => <ListItem key={type._id} type={type} />)}
                </div>
                <Link href="/type/new">
                    <div className="w-52 mt-4 mx-auto py-2 border rounded-lg text-lg">
                        {' '}
                        <span className="text-info-600">Create new</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
