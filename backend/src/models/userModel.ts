import mongoose, { Schema, Document, Model } from "mongoose";

// Define the User Interface
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// User Schema
const userSchema: Schema<IUser> = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// User Model
const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default userModel;
