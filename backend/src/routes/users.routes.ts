import express, { Router } from "express";
import verifyJWT from "../middleware/verifyJWT";
import {
  addFollowerHandler,
  deleteFollowerHandler,
  getAllUsersHandler,
  getUserHandler,
} from "../controllers/users.controller";

const usersRoutes = express.Router();
usersRoutes.use(verifyJWT as express.RequestHandler);

usersRoutes.get("/", async (req, res) => {
  await getAllUsersHandler(req, res);
});

usersRoutes.get("/:userId", async (req, res) => {
  await getUserHandler(req, res);
});
usersRoutes.post("/followers/:userId", async (req, res) => {
  await addFollowerHandler(req, res);
});
usersRoutes.delete("/followers/:userId", async (req, res) => {
  deleteFollowerHandler(req, res);
});

export default usersRoutes;
