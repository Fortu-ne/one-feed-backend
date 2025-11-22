import postController from "../controllers/post.controller.mjs";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.mjs";

const postRouter =Router();

postRouter.post("/posts",authenticateToken,postController.createPost);
postRouter.get("/posts",authenticateToken,postController.getAllPosts);
postRouter.post("/posts/p/:id",authenticateToken,postController.getPost);
postRouter.delete("/posts/p/:id",authenticateToken,postController.deletePost);
postRouter.delete("/posts/user/:id",authenticateToken,postController.getAllPostsByUser);


export default postRouter;