import { Router } from "express";

import authRouter from "./authRoutes";
import productRouter from "./productRoutes";
import userRouter from "./userRoutes";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/product", authenticateToken, productRouter);

export default router;
