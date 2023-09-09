import Link from 'next/link';

import { ICard } from '../models/Card';

import styles from './Card.module.css';

export function Card(props: { card: ICard }) {
    return (
        <Link href={`/cards/${props.card.id}`} className={styles.card}>
            Card
        </Link>
    );
}
