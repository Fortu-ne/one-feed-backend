import { Router } from "express";
import CommentController from "../controllers/comment.controller.mjs";

const commentRouter = Router();

commentRouter.post("/comments/p/:id",CommentController.create);
commentRouter.get("/comments/p/:id",CommentController.create);
commentRouter.delete("/comments/:id",CommentController.delete);
commentRouter.get("/comments/p/:id",CommentController.getCommentsByPost);


export default commentRouter;