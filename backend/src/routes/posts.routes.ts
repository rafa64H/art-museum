import express, { RequestHandler } from "express";
import verifyJWT from "../middleware/verifyJWT";
import {
  createPostHandler,
  getSinglePostHandler,
} from "../controllers/posts.controller";

const postsRoutes = express.Router();

postsRoutes.get("/:postId", async (req, res) => {
  await getSinglePostHandler(req, res);
});
postsRoutes.post("/", verifyJWT as RequestHandler, async (req, res) => {
  await createPostHandler(req, res);
});

export default postsRoutes;
