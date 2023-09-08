import mongoose, { Schema, Document } from 'mongoose';

import { IUser } from './User';

export interface IType extends Document {
    user: IUser['_id'];
    name: string;
}

const typeSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
});

export default mongoose.models.Type || mongoose.model<IType>('Type', typeSchema);
