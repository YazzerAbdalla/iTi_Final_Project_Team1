import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ExtendedRequest from "../types/ExtendedRequest";
import userModel from "../models/userModel";

interface PayloadProp {
  email: string;
  firstName: string;
  lastName: string;
}

const validateJWT = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid." });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY || "", async (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    if (!payload) {
      return res.status(403).json({ message: "Invalid payload token." });
    }
    const userPayload = payload as any;
    const { email } = userPayload;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: "Invalid payload token." });
    }
    const userId = user._id;
    req.user = userId;
    next();
  });
};

export default validateJWT;
