import { Router } from "express";
import { login, createUser } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/create", createUser);

userRouter.post("/login", login);

export default userRouter;
