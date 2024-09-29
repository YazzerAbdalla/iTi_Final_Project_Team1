import express, { Response } from "express";
import ExtendedRequest from "../types/ExtendedRequest";
import userModel, { IUser } from "../models/userModel";
import validateJWT from "../middlewares/validateJWT";
import {
  addItemToCart,
  checkout,
  clearCartForUser,
  getActiveCart,
  removeItemFromCart,
  updateItemInCart,
} from "../services/cartService";

const router = express.Router();

// get active cart
router.get("/", validateJWT, async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user;
    const cart = await getActiveCart({ userId });
    res.status(200).json({ data: cart });
  } catch (err) {
    console.error("CART route error:", err); // Log the error for debugging
    res.status(500).json({ message: "Something went wrong!" });
  }
});

// clear cart for user
router.delete("/", validateJWT, async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user;
    const { statusCode, data } = await clearCartForUser({
      userId,
    });
    res.status(statusCode).json({ data });
  } catch (error: any) {
    console.log("/cart DELETE error", error.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.post(
  "/item",
  validateJWT,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.user;
      const { itemId, quantity } = await req.body;
      const { data, statusCode } = await addItemToCart({
        userId,
        itemId,
        quantity,
      });
      res.status(statusCode).json({ data });
    } catch (err) {
      console.error("cart/item POST route error:", err); // Log the error for debugging
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);

router.delete(
  "/item/:productId",
  validateJWT,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.user;
      const { productId } = req.params;
      const { data, statusCode } = await removeItemFromCart({
        userId,
        productId,
      });
      res.status(statusCode).json({ data });
    } catch (error) {
      console.error("cart/item DELETE route error:", error); // Log the error for debugging
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);

router.put(
  "/item",
  validateJWT,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.user;
      const { itemId, quantity } = await req.body;
      const { statusCode, data } = await updateItemInCart({
        userId,
        itemId,
        quantity,
      });
      res.status(statusCode).json({ data });
    } catch (error) {
      console.log("cart/item PUT error", error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);

router.post(
  "/checkout",
  validateJWT,
  async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = req.user;
      const { statusCode, data } = await checkout({
        userId,
      });
      res.status(statusCode).json({ data });
    } catch (error: any) {
      console.log("/checkout POST error", error.message);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);
export default router;
