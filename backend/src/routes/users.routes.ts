import express, { RequestHandler, Router } from "express";
import verifyJWT from "../middleware/verifyJWT";
import {
  addOrRemoveFollowerHandler,
  addOrRemoveFollowingHandler,
  changePasswordHandler,
  editUserHandler,
  getAllUsersHandler,
  getFollowersFromUser,
  getFollowingFromUser,
  getUserHandler,
  undoEmailChangeHandler,
} from "../controllers/users.controller";
import multer from "multer";
const formDataHandler = multer({
  storage: multer.memoryStorage(),
});
const usersRoutes = express.Router();
usersRoutes.get("/", async (req, res) => {
  await getAllUsersHandler(req, res);
});
usersRoutes.get("/:userId", async (req, res) => {
  await getUserHandler(req, res);
});

usersRoutes.get(
  "/:userId/followers",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await getFollowersFromUser(req, res);
  }
);

usersRoutes.get(
  "/:userId/following",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await getFollowingFromUser(req, res);
  }
);

usersRoutes.put(
  "/:userId",
  verifyJWT as RequestHandler,
  formDataHandler.single("file"),
  async (req, res) => {
    await editUserHandler(req, res);
  }
);

usersRoutes.put(
  "/undo-email-change",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await undoEmailChangeHandler(req, res);
  }
);

usersRoutes.put(
  "/change-password",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await changePasswordHandler(req, res);
  }
);

usersRoutes.put(
  "/:userId/followers/",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await addOrRemoveFollowerHandler(req, res);
  }
);
usersRoutes.put(
  "/:userId/following/",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await addOrRemoveFollowingHandler(req, res);
  }
);

export default usersRoutes;
