import express, { Router } from "express";
import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  resetPasswordHandler,
  sendEmailVerificationCodeHandler,
  signUpHandler,
  verifyEmailHandler,
} from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/signup", async (req, res) => {
  await signUpHandler(req, res);
});
authRoutes.post("/login", async (req, res) => {
  await loginHandler(req, res);
});
authRoutes.get("/refresh", async (req, res) => {
  await refreshHandler(req, res);
});
authRoutes.get("/logout", logoutHandler);
authRoutes.post("/verify-email", async (req, res) => {
  await verifyEmailHandler(req, res);
});

authRoutes.get("/request-email-code/:userId", async (req, res) => {
  await sendEmailVerificationCodeHandler(req, res);
});

authRoutes.post("/password/forgot-password", async (req, res) => {
  await forgotPasswordHandler(req, res);
});
authRoutes.post("/password/reset-password/:token", async (req, res) => {
  await resetPasswordHandler(req, res);
});

export default authRoutes;
