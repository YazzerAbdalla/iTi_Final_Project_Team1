import mongoose, { Schema, Document, Model } from "mongoose";
import moment from "moment"; // Use moment.js for formatting

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
  date: string; // Add the date field
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
  date: {
    type: String,
    required: true,
    default: () => moment().format("YYYY-MM-DD"), // Set default to the current date in 'YYYY-MM-DD' format
  },
});

// Order Model
const orderModel: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);

export default orderModel;
