import Link from 'next/link';

import { ICard } from '../models/Card';

export function Card(props: { card: ICard }) {
    const { _id, image_front } = props.card;

    return (
        <Link
            href={`/cards/${_id}`}
            className="w-80 h-52 overflow-hidden rounded-3xl border border-primary-400 -mb-36 hover:-mb-12 transition-all"
        >
            <img
                src={image_front || 'https://placehold.co/600x400?text=Placeholder'}
                alt="placeholder"
                className="w-full h-full object-cover object-center"
            />
        </Link>
    );
}
