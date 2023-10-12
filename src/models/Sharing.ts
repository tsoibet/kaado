import mongoose, { Schema, Document } from 'mongoose';

import { ICard } from './Card';
import { IUser } from './User';

export interface ISharing extends Document {
    user: IUser['_id'];
    card: ICard['_id'];
    recipient: IUser['_id'];
    created_at: Date;
    recieved_at: Date;
    valid_until: Date;
    isComplete: boolean;
}

const sharingSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    card: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    recieved_at: { type: Date },
    valid_until: { type: Date, required: true },
    isComplete: { type: Boolean, default: false },
});

export default mongoose.models.Sharing || mongoose.model<ISharing>('Sharing', sharingSchema);
