import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { insertDumyProduct } from "./services/productService";
import userController from "./controllers/userController";
import productController from "./controllers/productController";
import cartController from "./controllers/cartController";
import orderController from "./controllers/orderController";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL || "")
  .then(() => {
    console.log("DB connected successfully!");
  })
  .catch((error) => {
    console.error("The error info: ", error.message);
  });
insertDumyProduct();
app.use(userController);
app.use(productController);
app.use("/cart", cartController);
app.use(orderController);

app.listen(3001, () => {
  console.log("Server working successfully on port 3001");
});
