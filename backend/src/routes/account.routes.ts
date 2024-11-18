import express, { Router } from "express";
import verifyJWT from "../middleware/verifyJWT";
import {
  changePasswordHandler,
  editAccountHandler,
} from "../controllers/account.controller";

const accountRoutes = express.Router();
accountRoutes.use(verifyJWT as express.RequestHandler);

accountRoutes.put("/edit-account", async (req, res) => {
  await editAccountHandler(req, res);
});
accountRoutes.put("/change-password", async (req, res) => {
  await changePasswordHandler(req, res);
});

export default accountRoutes;
