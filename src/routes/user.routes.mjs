import { UserController } from "../controllers/user.controller.mjs";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.mjs";

const userRoute = Router();

userRoute.get("/users",authenticateToken,UserController.getAllUsers);


export default userRoute;