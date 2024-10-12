import express, { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  signUpHandler,
  verifyEmailHandler,
} from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/signup", signUpHandler);
authRoutes.post("/login", loginHandler);
// authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.post("/verify-email/:code", verifyEmailHandler);
// authRoutes.post("/password/forgot", sendPasswordResetHandler);
// authRoutes.post("/password/reset", resetPasswordHandler);

export default authRoutes;
