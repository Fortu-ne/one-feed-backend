import { Router } from "express";
import { authenticateToken } from "../middleware/auth.mjs";
import LikeController from "../controllers/like.controller.mjs";

const likeRouter = Router();

likeRouter.post('/posts/:id/likes', authenticateToken,LikeController.toggleLike);
likeRouter.get('/posts/:id/likes',authenticateToken,LikeController.getAllByPost);

export default likeRouter;