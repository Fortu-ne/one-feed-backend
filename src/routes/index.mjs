import { Router } from "express";
import authRouter from "./auth.routes.mjs";
import userRoute from "./user.routes.mjs";
import postRouter from "./post.routes.mjs";
import likeRouter from "./like.routes.mjs";
import commentRouter from "./comment.routes.mjs";
import profileRouter from "./profile.routes.mjs";

const route = Router();

route.use(userRoute);
route.use(authRouter);
route.use(postRouter);
route.use(likeRouter);
route.use(profileRouter);
route.use(commentRouter);

export default route;