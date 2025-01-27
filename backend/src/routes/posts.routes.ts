import express, { RequestHandler } from "express";
import verifyJWT from "../middleware/verifyJWT";
import {
  createPostHandler,
  getAllComments,
  getSinglePostHandler,
} from "../controllers/posts.controller";

const postsRoutes = express.Router();

postsRoutes.get("/:postId", async (req, res) => {
  await getSinglePostHandler(req, res);
});
postsRoutes.post("/", verifyJWT as RequestHandler, async (req, res) => {
  await createPostHandler(req, res);
});

postsRoutes.get("/:postId/comments", async (req, res) => {
  await getAllComments(req, res);
});

postsRoutes.post("/:postId/comments/:commentId", async (req, res) => {});

postsRoutes.put("/:postId/comments/:commentId", async (req, res) => {});

export default postsRoutes;
