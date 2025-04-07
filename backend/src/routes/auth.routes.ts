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
import multer from "multer";

const authRoutes = express.Router();

const formDataHandler = multer({
  storage: multer.memoryStorage(),
});
authRoutes.post("/signup", formDataHandler.single("file"), async (req, res) => {
  await signUpHandler(req, res);
});
authRoutes.post("/login", formDataHandler.single("file"), async (req, res) => {
  await loginHandler(req, res);
});
authRoutes.get("/refresh", async (req, res) => {
  await refreshHandler(req, res);
});
authRoutes.get("/logout", logoutHandler);
authRoutes.post(
  "/verify-email/:userId/:code",
  formDataHandler.single("file"),
  async (req, res) => {
    await verifyEmailHandler(req, res);
  }
);

authRoutes.get(
  "/request-email-code/:userId",
  formDataHandler.single("file"),
  async (req, res) => {
    await sendEmailVerificationCodeHandler(req, res);
  }
);

authRoutes.put(
  "/password/forgot-password",
  formDataHandler.single("file"),
  async (req, res) => {
    await forgotPasswordHandler(req, res);
  }
);
authRoutes.put(
  "/password/reset-password",
  formDataHandler.single("file"),
  async (req, res) => {
    await resetPasswordHandler(req, res);
  }
);

export default authRoutes;
