import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import userController from "./controllers/userController";
import dotenv from "dotenv";
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

app.use(userController);

app.listen(3001, () => {
  console.log("Server working successfully on port 3001");
});
