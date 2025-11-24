import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.mjs";
import { upload } from "../config/cloudinary.mjs"; 


const authRouter = Router();

authRouter.post("/signup", upload.single("profile"), AuthController.signup);
authRouter.post("/login",AuthController.login);


export default authRouter;