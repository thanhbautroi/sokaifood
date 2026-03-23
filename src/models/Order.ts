import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from './Product';
import { IUser } from './User';

export interface IOrderItem {
    productId: string | IProduct;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface IOrder {
    _id?: string;
    userId?: string | IUser;
    items: IOrderItem[];
    guestInfo?: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    totalAmount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: 'cod' | 'bank_transfer';
    paymentStatus: 'pending' | 'paid' | 'failed';
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IOrderDocument extends Document {
    userId?: mongoose.Types.ObjectId;
    items: IOrderItem[];
    guestInfo?: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    totalAmount: number;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    notes?: string;
}

const OrderItemSchema = new Schema(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
    },
    { _id: false }
);

const OrderSchema = new Schema<IOrderDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        items: [OrderItemSchema],
        guestInfo: {
            name: { type: String },
            email: { type: String },
            phone: { type: String },
            address: { type: String },
        },
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            enum: ['cod', 'bank_transfer'],
            default: 'cod',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
