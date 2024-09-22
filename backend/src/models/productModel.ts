import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Rating Interface
interface IRating {
  rate: number;
  count: number;
}

// Define the Product Interface
interface IProduct extends Document {
  id: number;
  title: string;
  image: string;
  description: string;
  price: number;
  category: string; // New property
  rating: IRating; // New property
}

// Product Schema
const productSchema: Schema<IProduct> = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // New property
  rating: {
    // New property
    rate: { type: Number, required: true },
    count: { type: Number, required: true },
  },
});

// Product Model
const productModel: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export default productModel;
