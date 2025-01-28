import express, { RequestHandler } from "express";
import verifyJWT from "../middleware/verifyJWT";
import {
  createCommentHandler,
  createPostHandler,
  editCommentHandler,
  getAllCommentsHandler,
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
  await getAllCommentsHandler(req, res);
});

postsRoutes.post("/:postId/comments/", async (req, res) => {
  await createCommentHandler(req, res);
});

postsRoutes.put("/:postId/comments/:commentId", async (req, res) => {
  await editCommentHandler(req, res);
});

export default postsRoutes;
