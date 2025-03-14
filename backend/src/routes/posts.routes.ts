import express, { RequestHandler } from "express";
import verifyJWT from "../middleware/verifyJWT";
import {
  createCommentHandler,
  createPostHandler,
  createReplyHandler,
  editCommentHandler,
  editReplyHandler,
  getAllCommentsHandler,
  getAllRepliesFromCommentHandler,
  getSinglePostHandler,
  likePostHandler,
  dislikePostHandler,
  likeCommentHandler,
  dislikeCommentHandler,
  likeReplyHandler,
  dislikeReplyHandler,
} from "../controllers/posts.controller";

const postsRoutes = express.Router();

postsRoutes.get("/:postId", async (req, res) => {
  await getSinglePostHandler(req, res);
});
postsRoutes.post("/", verifyJWT as RequestHandler, async (req, res) => {
  await createPostHandler(req, res);
});

postsRoutes.post(
  "/:postId/likes",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await likePostHandler(req, res);
  }
);

postsRoutes.post(
  "/:postId/dislikes",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await dislikePostHandler(req, res);
  }
);

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

postsRoutes.post(
  "/:postId/comments/:commentId/likes",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await likeCommentHandler(req, res);
  }
);
postsRoutes.post(
  "/:postId/comments/:commentId/dislikes",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await dislikeCommentHandler(req, res);
  }
);
postsRoutes.get("/:postId/comments/:commentId/replies", async (req, res) => {
  await getAllRepliesFromCommentHandler(req, res);
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

postsRoutes.post(
  "/:postId/comments/:commentId/replies/:replyId/likes",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await likeReplyHandler(req, res);
  }
);
postsRoutes.post(
  "/:postId/comments/:commentId/replies/:replyId/dislikes",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await dislikeReplyHandler(req, res);
  }
);

export default postsRoutes;
