import Link from 'next/link';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { AddCardIcon } from '@/components/icons/AddCardIcon';
import { FilterIcon } from '@/components/icons/FilterIcon';
import { SortIcon } from '@/components/icons/SortIcon';
import { UserIcon } from '@/components/icons/UserIcon';
import { getCards } from '@/services/cardService';

async function showSortDropdown() {
    'use server';
    //TODO: Implement real showSortDropdown function
    console.log('showSortDropdown');
}

async function showFilterDropdown() {
    'use server';
    //TODO: Implement real showFilterDropdown function
    console.log('showFilterDropdown');
}

export default async function Home() {
    const { cards } = await getCards();

    return (
        <div className="w-96 min-h-screen p-4 grid grid-rows-[auto_1fr] gap-4">
            <header className="flex justify-between items-center">
                <div className="text-3xl font-bold">Kaado</div>
                <div className="flex gap-2">
                    <Link href="/cards/add">
                        <AddCardIcon />
                    </Link>
                    <Button icon={<SortIcon />} onClickHandler={showSortDropdown} />
                    <Button icon={<FilterIcon />} onClickHandler={showFilterDropdown} />
                    <Link href="/user">
                        <UserIcon />
                    </Link>
                </div>
            </header>
            {cards ? (
                <div className="justify-self-center flex flex-col">
                    {cards.map((card) => (
                        <Card key={card.id} card={card} />
                    ))}
                </div>
            ) : (
                <div className="p-4 self-center">
                    Keep all the cards you use every day all in one place.
                </div>
            )}
        </div>
    );
}
