import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ExtendedRequest from "../types/ExtendedRequest";

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

  jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    // Attach the decoded payload to the request object
    req.user = payload; // You might want to define a type for `req.user`

    next(); // Call the next middleware or route handler
  });
};

export default validateJWT;
