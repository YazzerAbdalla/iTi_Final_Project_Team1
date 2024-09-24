import express, { Request, Response } from "express";
import { getAllProducts, getProductById } from "../services/productService";

const router = express.Router();

router.get("/product", async (req: Request, res: Response) => {
  try {
    const result = await getAllProducts();
    res.status(result.statusCode).json({ data: result.data });
  } catch (err) {
    console.error("/product route error:", err); // Log the error for debugging
    res.status(500).json({ message: "Something went wrong!" });
  }
});

router.get("/product/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await getProductById(Number(id));
    res.status(result.statusCode).json({ data: result.data });
  } catch (err) {
    console.error("/product/:id GET route error:", err); // Log the error for debugging
    res.status(500).json({ message: "Something went wrong!" });
  }
});

export default router;
