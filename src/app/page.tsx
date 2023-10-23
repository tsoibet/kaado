import HomePage from './HomePage';

import { getCards } from '@/services/cardService';
import { getTypes } from '@/services/typeService';

export default async function Home() {
    const { cards } = await getCards();
    const { types } = await getTypes();

    return (
        <div className="w-96 min-h-screen p-4 grid grid-rows-[auto_1fr] gap-4">
            <HomePage cards={cards} types={types} />
        </div>
    );
}
