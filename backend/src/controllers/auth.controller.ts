import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserModel } from "../models/user.model";
import { Request, Response } from "express";
import {
  generateJWTTokensAndSetCookies,
  RefreshTokenPayload,
  verifyToken,
} from "../utils/jwtFunctions";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../services/mailtrap/mailtrap";
import { ObjectId } from "mongodb";
import ErrorReturn from "../constants/ErrorReturn";
import SessionModel from "../models/session.model";
import { JWT_SECRET } from "../constants/env";
import { thirtyDaysFromNow } from "../utils/date";

export const signUpHandler = async (req: Request, res: Response) => {
  const { email, password, name, username } = req.body as unknown as {
    email: string;
    password: string;
    name: string;
    username: string;
  };

  try {
    if (!email || !password || !name || !username) {
      throw new ErrorReturn(400, "Some fields are empty");
    }

    const alreadyUsedEmail = await UserModel.findOne({ email });
    const alreadyUsedUsername = await UserModel.findOne({ username });

    if (alreadyUsedEmail) {
      throw new ErrorReturn(400, "Email already in use");
    }
    if (alreadyUsedUsername) {
      throw new ErrorReturn(400, "Username already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new UserModel({
      email,
      password: hashedPassword,
      name,
      username,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    const userId = user._id as ObjectId;

    const session = new SessionModel({
      userId,
      userAgent: req.headers["user-agent"],
    });

    const sessionId = session._id as ObjectId;

    // jwt
    const tokens = generateJWTTokensAndSetCookies(res, userId, sessionId);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user.toObject(),
        session,
        tokens,
        password: undefined,
      },
    });
  } catch (error) {
    const isErrorReturn = error instanceof ErrorReturn;
    console.log(error);

    res
      .status(isErrorReturn ? error.status : 500)
      .json({ success: false, message: isErrorReturn ? error.message : error });
  }
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const { code, userId } = req.body as { code: string; userId: ObjectId };
  try {
    const user = await UserModel.findOne({
      _id: userId,
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      throw new ErrorReturn(400, 'Invalid or expired verification code"');
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user.toObject(),
        password: undefined,
      },
    });
  } catch (error) {
    const isErrorReturn = error instanceof ErrorReturn;
    console.log(error);

    res
      .status(isErrorReturn ? error.status : 500)
      .json({ success: false, message: isErrorReturn ? error.message : error });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body as {
    emailOrUsername: string;
    password: string;
  };

  try {
    let user = null;
    if (emailOrUsername.startsWith("@")) {
      user = await UserModel.findOne({ username: emailOrUsername });
    } else {
      user = await UserModel.findOne({ email: emailOrUsername });
    }

    if (!user) {
      throw new ErrorReturn(400, "Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ErrorReturn(400, "Invalid credentials");
    }

    const userId = user._id as ObjectId;

    const session = new SessionModel({
      userId,
      userAgent: req.headers["user-agent"],
    });

    const sessionId = session._id as ObjectId;

    // jwt
    const tokens = generateJWTTokensAndSetCookies(res, userId, sessionId);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user.toObject(),
        password: undefined,
      },
    });
  } catch (error) {
    const isErrorReturn = error instanceof ErrorReturn;
    console.log(error);

    res
      .status(isErrorReturn ? error.status : 500)
      .json({ success: false, message: isErrorReturn ? error.message : error });
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  const { emailOrUsername } = req.body as { emailOrUsername: string };
  try {
    let user = null;
    if (emailOrUsername.startsWith("@")) {
      user = await UserModel.findOne({ username: emailOrUsername });
    } else {
      user = await UserModel.findOne({ email: emailOrUsername });
    }

    if (!user) {
      throw new ErrorReturn(404, "User not found");
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    const resetTokenExpiresAtDate = new Date(resetTokenExpiresAt);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAtDate;

    await user.save();

    const resetURL = `${process.env.SERVER_URL}/reset-password/${resetToken}`;

    // send email
    await sendPasswordResetEmail(user.email, resetURL);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    const isErrorReturn = error instanceof ErrorReturn;
    console.log(error);

    res
      .status(isErrorReturn ? error.status : 500)
      .json({ success: false, message: isErrorReturn ? error.message : error });
  }
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body as { password: string };

    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      throw new ErrorReturn(400, "Invalid or expired reset token");
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    const isErrorReturn = error instanceof ErrorReturn;
    console.log(error);

    res
      .status(isErrorReturn ? error.status : 500)
      .json({ success: false, message: isErrorReturn ? error.message : error });
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken as string | undefined;

    if (!refreshToken) {
      throw new ErrorReturn(401, "No refresh Token available");
    }

    const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
      secret: JWT_SECRET,
    });

    if (!payload) {
      console.log(payload);
      throw new ErrorReturn(401, "Invalid refresh token");
    }

    const now = Date.now();

    const session = await SessionModel.findById(payload.sessionId);

    if (!session || session.expiresAt.getTime() > now) {
      throw new ErrorReturn(401, "Session expired");
    }

    const tenDaysInMS = 10 * 24 * 60 * 60 * 1000;

    const sessionNeedsRefresh =
      session.expiresAt.getTime() - now <= tenDaysInMS;

    if (sessionNeedsRefresh) {
      session.expiresAt = thirtyDaysFromNow();
      await session.save();

      const userId = session._id as ObjectId;
      const sessionId = session._id as ObjectId;

      const newTokens = generateJWTTokensAndSetCookies(res, userId, sessionId);

      res.status(200).json({
        success: true,
        message: "Refresh token refreshed successfully",
      });
    }
  } catch (error) {
    const isErrorReturn = error instanceof ErrorReturn;
    console.log(error);

    res
      .status(isErrorReturn ? error.status : 500)
      .json({ success: false, message: isErrorReturn ? error.message : error });
  }
};
