// routes/userRoutes.ts
import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controller/userController";

const userRouter = Router();

userRouter.post("/users", createUser);
userRouter.get("/users/:id", getUser);
userRouter.put("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);

export default userRouter;
