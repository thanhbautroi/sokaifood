import mongoose, { Schema, Document } from 'mongoose';

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    role: 'user' | 'admin';
    phone?: string;
    address?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IUserDocument extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'user' | 'admin';
    phone?: string;
    address?: string;
}

const UserSchema = new Schema<IUserDocument>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        phone: { type: String },
        address: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
