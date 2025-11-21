import { UserController } from "../controllers/user.controller.mjs";
import { Router } from "express";

const userRoute = Router();

userRoute.get("/users",UserController.getAllUsers);
userRoute.get("/users/:id",UserController.getById);


export default userRoute;