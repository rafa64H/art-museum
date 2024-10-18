import express, { Router } from "express";
import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  resetPasswordHandler,
  signUpHandler,
  verifyEmailHandler,
} from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/signup", signUpHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.post("/verify-email/:code", verifyEmailHandler);
authRoutes.post("/password/forgot-password", forgotPasswordHandler);
authRoutes.post("/password/reset-password/:token", resetPasswordHandler);

export default authRoutes;
