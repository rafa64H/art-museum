import express, { RequestHandler, Router } from "express";
import verifyJWT from "../middleware/verifyJWT";
import {
  addFollowerHandler,
  changePasswordHandler,
  deleteFollowerHandler,
  editUserHandler,
  getAllUsersHandler,
  getFollowersFollowingFromUser,
  getUserHandler,
} from "../controllers/users.controller";

const usersRoutes = express.Router();
usersRoutes.get("/", async (req, res) => {
  await getAllUsersHandler(req, res);
});
usersRoutes.get("/:userId", async (req, res) => {
  await getUserHandler(req, res);
});

usersRoutes.get(
  "/followers/:userId",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await getFollowersFollowingFromUser(req, res);
  }
);

usersRoutes.put(
  "/edit-account",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await editUserHandler(req, res);
  }
);

usersRoutes.put(
  "/change-password",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await changePasswordHandler(req, res);
  }
);

usersRoutes.post(
  "/followers/:userId",
  verifyJWT as RequestHandler,
  async (req, res) => {
    await addFollowerHandler(req, res);
  }
);
usersRoutes.delete(
  "/followers/:userId",
  verifyJWT as RequestHandler,
  async (req, res) => {
    deleteFollowerHandler(req, res);
  }
);

export default usersRoutes;
