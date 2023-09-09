import mongoose, { Schema, Document } from 'mongoose';

import { IType } from './Type';
import { IUser } from './User';

export interface ICard extends Document {
    user: IUser['_id'];
    type: IType['_id'];
    name: string;
    image_front: string;
    image_back: string;
    number: string;
    note: string;
    created_at: Date;
    updated_at: Date;
}

const cardSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: Schema.Types.ObjectId, ref: 'Type', required: true },
        name: String,
        image_front: String,
        image_back: String,
        number: String,
        note: String,
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.Card || mongoose.model<ICard>('Card', cardSchema);
