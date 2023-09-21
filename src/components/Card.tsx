import Link from 'next/link';

import { ICard } from '../models/Card';

export function Card(props: { card: ICard }) {
    const { id, image_front } = props.card;

    return (
        <Link
            href={`/cards/${id}`}
            className="w-80 h-52 overflow-hidden rounded-3xl border-2 -mt-36 first:mt-0"
        >
            <img
                srcSet={image_front || 'https://placehold.co/600x400?text=Placeholder'}
                alt="placeholder"
                className="w-full h-full object-cover object-center"
            />
        </Link>
    );
}
