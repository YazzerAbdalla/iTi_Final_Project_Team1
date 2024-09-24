import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Order Item Interface
export interface IOrderItem {
  productName: string;
  productImage: string;
  productPrice: number;
  productQuantity: number;
}

// Define the Order Interface
interface IOrder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
}

// Order Items Schema
const orderItemsSchema: Schema<IOrderItem> = new mongoose.Schema({
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productQuantity: { type: Number, required: true },
});

// Order Schema
const orderSchema: Schema<IOrder> = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemsSchema],
  totalPrice: { type: Number, required: true },
});

// Order Model
const orderModel: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default orderModel;
