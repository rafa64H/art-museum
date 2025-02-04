import express, { RequestHandler } from "express";
import verifyJWT from "../middleware/verifyJWT";
import {
  createCommentHandler,
  createPostHandler,
  createReplyHandler,
  editCommentHandler,
  editReplyHandler,
  getAllCommentsHandler,
  getAllRepliesHandler,
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

postsRoutes.post(
  "/:postId/comments/",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await createCommentHandler(req, res);
  }
);

postsRoutes.put(
  "/:postId/comments/:commentId",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await editCommentHandler(req, res);
  }
);

postsRoutes.get("/:postId/comments/:commentId/replies", async (req, res) => {
  await getAllRepliesHandler(req, res);
});

postsRoutes.post(
  "/:postId/comments/:commentId/replies",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await createReplyHandler(req, res);
  }
);

postsRoutes.put(
  "/:postId/comments/:commentId/replies/:replyId",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await editReplyHandler(req, res);
  }
);

export default postsRoutes;
