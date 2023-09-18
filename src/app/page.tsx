import Link from 'next/link';

import { ICard } from '../models/Card';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

async function getCards() {
    //TODO: Implement real getCards function
    console.log('getCards');
    const cards: ICard[] = [];
    return cards;
}

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
    const cards = await getCards();

    return (
        <div className="w-96 min-h-screen p-4 grid grid-rows-[auto_1fr] gap-4">
            <header className="flex justify-between items-center">
                <div className="text-3xl font-bold">Kaado</div>
                <div className="flex gap-2">
                    <Link href="/cards/add">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="homebtn"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </Link>
                    <Button
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="homebtn"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        }
                        onClickHandler={showSortDropdown}
                    />
                    <Button
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="homebtn"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        }
                        onClickHandler={showFilterDropdown}
                    />
                    <Link href="/user">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="homebtn"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </Link>
                </div>
            </header>
            {cards.length ? (
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
