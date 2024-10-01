import express, { Response } from "express";
import validateJWT from "../middlewares/validateJWT";
import ExtendedRequest from "../types/ExtendedRequest";
import { getOrderForUser } from "../services/orderService";
const router = express.Router();
router.get(
  "/order",
  validateJWT,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.user;

      const result = await getOrderForUser(userId);
      res.status(result.statusCode).json({ data: result.data });
    } catch (error: any) {
      res.status(500).json({ message: "Something wronge in fetching order" });
    }
  }
);
export default router;
