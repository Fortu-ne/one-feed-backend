import postController from "../controllers/post.controller.mjs";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.mjs";
import { upload } from "../config/cloudinary.mjs";

const postRouter =Router();

postRouter.post('/posts', authenticateToken, upload.single('image'), postController.createPost);
postRouter.get("/posts",authenticateToken,postController.getAllPosts);
postRouter.get("/posts/p/:id",authenticateToken,postController.getPost);
postRouter.delete("/posts/p/:id",authenticateToken,postController.deletePost);
postRouter.get("/p/user/:id",postController.getAllPostsByUser);




export default postRouter;