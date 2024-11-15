import express, { Router } from "express";
import verifyJWT from "../middleware/verifyJWT";
import { editAccountHandler } from "../controllers/account.controller";

const accountRoutes = express.Router();
accountRoutes.use(verifyJWT as express.RequestHandler);

accountRoutes.put("/edit-account", async (req, res) => {
  await editAccountHandler(req, res);
});

export default accountRoutes;
