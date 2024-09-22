import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Product Interface
interface IProduct extends Document {
  id: number;
  title: string;
  image: string;
  description: string;
  price: number;
}

// Product Schema
const productSchema: Schema<IProduct> = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

// Product Model
const productModel: Model<IProduct> = mongoose.model<IProduct>(
  "Products",
  productSchema
);

export default productModel;
