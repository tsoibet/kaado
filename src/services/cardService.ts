'use server';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/dbConnect';
import { stringToObjectId } from '@/lib/utils';
import CardModel, { ICard } from '@/models/Card';
import TypeModel, { IType } from '@/models/Type';

export async function getCards() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: 'User not found' };
        }
        const user = stringToObjectId(session.user.id);
        if (!user) {
            return { error: 'User not found' };
        }

        const cards = await CardModel.find<ICard>({ user }).select(
            '_id image_front created_at type'
        );

        return { cards };
    } catch (error) {
        console.log(error);
        return { error: 'Failed to get cards' };
    }
}

export async function getCard(id: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: 'User not found' };
        }
        const user = stringToObjectId(session.user.id);
        if (!user) {
            return { error: 'User not found' };
        }

        const parsedId = stringToObjectId(id);
        if (!parsedId) {
            return { error: 'Card not found' };
        }
        const card = await CardModel.findOne<ICard>({ _id: parsedId, user });
        if (card) {
            return { card };
        } else {
            return { error: 'Card not found' };
        }
    } catch (error) {
        console.log(error);
        return { error: 'Failed to get card' };
    }
}

export async function createCard({
    image_front,
    image_back,
    name,
    type_id,
    number,
    note,
}: {
    image_front: string;
    image_back: string;
    name: string;
    type_id: string;
    number: string;
    note: string;
}) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: 'User not found' };
        }
        const user = stringToObjectId(session.user.id);
        if (!user) {
            return { error: 'User not found' };
        }

        if (!image_front) {
            return { error: 'Image of front side is required' };
        }

        let type: IType | null;
        if (type_id) {
            const parsedTypeId = stringToObjectId(type_id);
            if (!parsedTypeId) {
                return { error: 'Type not found' };
            }
            type = await TypeModel.findOne<IType>({ _id: parsedTypeId, user });
            if (!type) {
                return { error: 'Type not found' };
            }
        } else {
            type = await TypeModel.findOne<IType>({ isDefault: true, user });
        }

        const card: ICard = await CardModel.create({
            user,
            image_front,
            image_back,
            name,
            type,
            number,
            note,
        });
        return { card };
    } catch (error) {
        console.log(error);
        return { error: 'Failed to add card' };
    }
}

export async function updateCard(
    id: string,
    {
        image_front,
        image_back,
        name,
        type_id,
        number,
        note,
    }: {
        image_front: string;
        image_back: string;
        name: string;
        type_id: string;
        number: string;
        note: string;
    }
) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: 'User not found' };
        }
        const user = stringToObjectId(session.user.id);
        if (!user) {
            return { error: 'User not found' };
        }

        const parsedId = stringToObjectId(id);
        if (!parsedId) {
            return { error: 'Card not found' };
        }

        if (!image_front) {
            return { error: 'Image of front side is required' };
        }

        let type: IType | null;
        if (!type_id) {
            type = await TypeModel.findOne<IType>({ isDefault: true, user });
        } else {
            const parsedTypeId = stringToObjectId(type_id);
            if (!parsedTypeId) {
                return { error: 'Type not found' };
            }
            type = await TypeModel.findOne<IType>({ _id: parsedTypeId, user });
            if (!type) {
                return { error: 'Type not found' };
            }
        }

        const card = await CardModel.findOneAndUpdate<ICard>(
            { _id: parsedId, user },
            { image_front, image_back, name, type_id, number, note },
            { new: true }
        );
        if (card) {
            return { card };
        } else {
            return { error: 'Card not found' }; //??
        }
    } catch (error) {
        console.log(error);
        return { error: 'Failed to update card' };
    }
}

export async function deleteCard(id: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: 'User not found' };
        }
        const user = stringToObjectId(session.user.id);
        if (!user) {
            return { error: 'User not found' };
        }

        const parsedId = stringToObjectId(id);
        if (!parsedId) {
            return { error: 'Card not found' };
        }
        const card = await CardModel.findById<ICard>(parsedId);
        if (card) {
            if (!user.equals(card.user)) {
                return { error: 'Unauthorized action' };
            }
            const result = await card.deleteOne();
            return { result };
        } else {
            return { error: 'Card not found' };
        }
    } catch (error) {
        console.log(error);
        return { error: 'Failed to delete card' };
    }
}
