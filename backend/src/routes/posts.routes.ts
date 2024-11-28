import express, { RequestHandler } from "express";
import verifyJWT from "../middleware/verifyJWT";
import { createPostHandler } from "../controllers/posts.controller";

const postsRoutes = express.Router();

postsRoutes.post("/", verifyJWT as RequestHandler, async (req, res) => {
  await createPostHandler(req, res);
});

export default postsRoutes;
