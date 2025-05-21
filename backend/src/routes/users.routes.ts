import express, { RequestHandler, Router } from "express";
import verifyJWT from "../middleware/verifyJWT";
import {
  addFollower,
  addFollowing,
  changePasswordHandler,
  editUserHandler,
  getAllUsersHandler,
  getFollowersFromUser,
  getFollowingFromUser,
  getUserHandler,
  removeFollower,
  removeFollowing,
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
  },
);

usersRoutes.get(
  "/:userId/following",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await getFollowingFromUser(req, res);
  },
);

usersRoutes.put(
  "/:userId",
  verifyJWT as RequestHandler,
  formDataHandler.single("file"),
  async (req, res) => {
    await editUserHandler(req, res);
  },
);

usersRoutes.put(
  "/:userId/password",
  verifyJWT as RequestHandler,
  formDataHandler.single("file"),
  async (req, res) => {
    await changePasswordHandler(req, res);
  },
);

usersRoutes.post(
  "/:userId/followers/",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await addFollower(req, res);
  },
);
usersRoutes.delete(
  "/:userId/followers/:userIdFollower",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await removeFollower(req, res);
  },
);
usersRoutes.post(
  "/:userId/following/",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await addFollowing(req, res);
  },
);
usersRoutes.delete(
  "/:userId/followers/userIdFollowing/:userIdFollowing",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await removeFollowing(req, res);
  },
);

export default usersRoutes;
