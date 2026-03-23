import mongoose, { Schema, Document } from 'mongoose';

export type CollectionType = 'do-cay' | 'trai-cay-say' | 'cac-loai-hat' | 'do-uong';

export interface IProduct {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  collectionType: CollectionType;
  featured: boolean;
  inStock: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IProductDocument extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  collectionType: CollectionType;
  featured: boolean;
  inStock: boolean;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    images: [{ type: String }],
    collectionType: { type: String, enum: ['do-cay', 'trai-cay-say', 'cac-loai-hat', 'do-uong'], required: true },
    featured: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
