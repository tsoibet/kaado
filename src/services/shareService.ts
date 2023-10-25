'use server';
import { getServerSession } from 'next-auth';

import connectDB from '../lib/dbConnect';
import { stringToObjectId } from '../lib/utils';

import CardAdaptor from './CardAdaptor';
import { createCard, getCard } from './cardService';
import { getTypes } from './typeService';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ICard } from '@/models/Card';
import SharingModel, { ISharing } from '@/models/Sharing';

export interface SharingInfo {
    _id: string;
    created_at: string;
    recieved_at: string;
    valid_until: string;
    isComplete: boolean;

    user: { name: string };
    card: { image_front: string };
    recipient?: { name: string };
}

export async function getSharings() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: 'User not found' };
        }
        const user = stringToObjectId(session.user.id);
        if (!user) {
            return { error: 'user not found' };
        }

        const sharings = await SharingModel.find<SharingInfo>({ user })
            .populate('user', 'name')
            .populate('recipient', 'name')
            .populate('card', 'image_front');

        return {
            sharings: JSON.parse(JSON.stringify(sharings)) as SharingInfo[],
        };
    } catch (error) {
        return { error };
    }
}

export async function createSharing(cardId: string, validHours = 24 * 7) {
    try {
        await connectDB();

        const { card } = await getCard(cardId);

        if (!card) {
            return { error: 'card not found' };
        }

        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: 'User not found' };
        }

        const user = stringToObjectId(session.user.id);
        if (!user) {
            return { error: 'user not found' };
        }
        const now = new Date();
        const valid_until = now.setTime(now.getTime() + validHours * 60 * 60 * 1000);

        const sharing: ISharing = await SharingModel.create({ user, card, valid_until });

        return {
            sharing,
        };
    } catch (error) {
        return { error };
    }
}

export async function getSharing(id: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: 'User not found' };
        }
        const user = stringToObjectId(session.user.id);
        if (!user) {
            return { error: 'user not found' };
        }

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: 'Sharing not found' };
        }
        const sharing = await SharingModel.findOne<ISharing>({ _id: parsedId, user });
        if (sharing) {
            return {
                sharing,
            };
        } else {
            return { error: 'Sharing not found' };
        }
    } catch (error) {
        return { error };
    }
}

export async function fetchSharing(id: string) {
    try {
        await connectDB();

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: 'Sharing not found' };
        }

        const sharing = await SharingModel.findOne<SharingInfo>({
            _id: parsedId,
            valid_until: { $gte: new Date() },
            isComplete: false,
        })
            .populate('user', 'name')
            .populate('recipient', 'name')
            .populate('card', 'image_front');
        if (sharing) {
            return {
                sharing: JSON.parse(JSON.stringify(sharing)) as SharingInfo,
            };
        } else {
            return { error: 'Sharing not found' };
        }
    } catch (error) {
        return { error };
    }
}

export async function executeSharing(id: string) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: 'User not found' };
        }

        const user = stringToObjectId(session.user.id);
        if (!user) {
            return { error: 'user not found' };
        }

        const sharing = await SharingModel.findOne<ISharing>({
            _id: id,
            valid_until: { $gte: new Date() },
            isComplete: false,
        });

        if (!sharing) {
            return { error: 'Sharing not found' };
        }
        const { card }: { card: ICard } = await sharing.populate('card');

        const { types } = await getTypes();
        if (!types) {
            return { error: 'Unable to copy card' };
        }
        const defaultType = types.filter((t) => t.isDefault)[0];
        if (!defaultType) {
            return { error: 'Unable to copy card' };
        }
        const { card: newCard, error } = await createCard(
            new CardAdaptor({
                image_front: card.image_front,
                image_back: card.image_back,
                name: card.name,
                type_id: defaultType._id!,
                number: card.number,
                note: card.note,
            })
        );
        if (newCard) {
            sharing.isComplete = true;
            sharing.recipient = user;
            sharing.recieved_at = new Date();
            sharing.save();
            return {
                card: newCard,
            };
        } else {
            console.log(error);
            return { error: 'Unable to copy card' };
        }
    } catch (error) {
        return { error };
    }
}

export async function deleteSharing(id: string) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session) {
            return { error: 'User not found' };
        }

        const user = stringToObjectId(session.user.id);
        if (!user) {
            return { error: 'user not found' };
        }

        const parsedId = stringToObjectId(id);

        if (!parsedId) {
            return { error: 'Sharing not found' };
        }
        const sharing = await SharingModel.findById<ISharing>(parsedId);
        if (sharing) {
            if (!user.equals(sharing.user)) {
                return { error: 'Unauthorized action' };
            }
            const result = await sharing.deleteOne();
            return { result };
        } else {
            return { error: 'Sharing not found' };
        }
    } catch (error) {
        return { error: 'Deletion failed' };
    }
}
