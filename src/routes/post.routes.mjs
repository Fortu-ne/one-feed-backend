import postController from "../controllers/post.controller.mjs";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.mjs";

const postRouter =Router();

postRouter.post("/posts",authenticateToken,postController.createPost);
postRouter.get("/posts",authenticateToken,postController.getAllPosts);
postRouter.post("/posts/:id",authenticateToken,postController.getPost);
postRouter.delete("/posts/:id",authenticateToken,postController.deletePost);


export default postRouter;