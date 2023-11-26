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
            <div className="w-full justify-self-center flex flex-col items-center gap-5">
                <div className="text-3xl font-bold m-4">Card Types</div>
                <div className="py-12 w-52 mx-auto text-justify">
                    {types && types.map((type) => <ListItem key={type._id} type={type} />)}
                </div>
                <div className="w-10/12 mt-4">
                    <Link href="/type/new">
                        <div className="p-2 text-info-600 text-center rounded-xl border">
                            Create New Type
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
