import express from "express";
import { postController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.USER), postController.createPost);

export const postRouter = router;
