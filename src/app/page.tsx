import Link from 'next/link';

import { ICard } from '../models/Card';

import styles from './page.module.css';

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
        <div className={styles.home}>
            <header className={styles.header}>
                <div className={styles.title}>Kaado</div>
                <div className={styles.panel}>
                    <Link href="/cards/add" className={styles.button}>
                        +
                    </Link>
                    <Button icon="v" onClickHandler={showSortDropdown} />
                    <Button icon=".." onClickHandler={showFilterDropdown} />
                    <Link href="/user" className={styles.button}>
                        *
                    </Link>
                </div>
            </header>
            {cards.length ? (
                <div className={styles.cards}>
                    {cards.map((card) => (
                        <Card key={card.id} card={card} />
                    ))}
                </div>
            ) : (
                <div className={styles.message}>
                    Keep all the cards you use every day all in one place.
                </div>
            )}
        </div>
    );
}
