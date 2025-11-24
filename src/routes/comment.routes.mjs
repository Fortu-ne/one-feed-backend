import { Router } from "express";
import CommentController from "../controllers/comment.controller.mjs";
import { authenticateToken } from "../middleware/auth.mjs";

const commentRouter = Router();

commentRouter.post("/p/:id/comments",authenticateToken,CommentController.create);
commentRouter.delete("/comments/:id",authenticateToken,CommentController.delete);
commentRouter.get("/p/:id/comments",authenticateToken,CommentController.getCommentsByPost);


export default commentRouter;