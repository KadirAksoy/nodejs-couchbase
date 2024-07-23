// routes/productRoutes.ts
import { Router } from "express";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController";

const productRouter = Router();

productRouter.post("/products", createProduct);
productRouter.get("/products/:id", getProduct);
productRouter.put("/products/:id", updateProduct);
productRouter.delete("/products/:id", deleteProduct);

export default productRouter;
