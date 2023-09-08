import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}
const userSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        password: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
