import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Cart Items Interface
interface ICartItem {
  productId: mongoose.Schema.Types.ObjectId;
  unitPrice: number;
  quantity: number;
}

// Define the Cart Interface
interface ICart extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  status: "active" | "completed";
}

// Cart Items Schema
const cartItemsSchema: Schema<ICartItem> = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
});

// Cart Schema
const cartSchema: Schema<ICart> = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemsSchema],
  totalPrice: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "completed"], default: "active" },
});

// Cart Model
const cartModel: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export default cartModel;
