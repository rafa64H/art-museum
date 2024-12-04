import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserModel } from "../models/user.model";
import { Request, Response } from "express";
import { RefreshTokenPayload, verifyToken } from "../utils/jwtFunctions";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../services/mailtrap/mailtrap";
import { ObjectId } from "mongodb";
import { JWT_SECRET_ACCESS, JWT_SECRET_REFRESH } from "../constants/env";
import { thirtyDaysFromNow } from "../utils/date";
import jwt from "jsonwebtoken";
import backendCheckValidityEmail from "../utils/form-input-validations/backendCheckValidityEmail";
import backendCheckValidityNameOrUsername from "../utils/form-input-validations/backendCheckValidityNameUsername";

export const signUpHandler = async (req: Request, res: Response) => {
  const { email, password, name, username } = req.body as unknown as {
    email: string;
    password: string;
    name: string;
    username: string;
  };

  try {
    if (!email || !password || !name || !username) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const usernameWithAt = `@${username}`;

    const alreadyUsedEmail = await UserModel.findOne({ email });
    const alreadyUsedUsername = await UserModel.findOne({ usernameWithAt });
    if (alreadyUsedEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }
    if (alreadyUsedUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username already in use" });
    }

    if (!backendCheckValidityEmail(email))
      return res.status(400).json({ success: false, message: "Invalid Email" });
    if (!backendCheckValidityNameOrUsername(name))
      return res.status(400).json({ success: false, message: "Invalid Name" });
    if (!backendCheckValidityNameOrUsername(username))
      return res
        .status(400)
        .json({ success: false, message: "Invalid Username" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      1000000 + Math.random() * 9000000
    ).toString();

    const role = "user";
    const user = new UserModel({
      email,
      password: hashedPassword,
      name,
      username: usernameWithAt,
      role,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    await user.save();

    const userId = (user._id as ObjectId).toString();
    // jwt
    const accessToken = jwt.sign({ userId, role }, JWT_SECRET_ACCESS, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ userId, role }, JWT_SECRET_REFRESH, {
      expiresIn: "30d",
    });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user.toObject(),
        password: undefined,
      },
      accessToken,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: error });
  }
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const { code, userId } = req.body as { code: string; userId: string };
  try {
    const userIdObjectId = ObjectId.createFromHexString(userId);

    const foundUser = await UserModel.findOne(userIdObjectId);

    const idxd = foundUser!._id as ObjectId;

    if (!foundUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired" });
    }

    if (foundUser.verificationToken === code) {
      foundUser.verified = true;
      foundUser.changedEmail = false;
      foundUser.verificationToken = undefined;
      foundUser.verificationTokenExpiresAt = undefined;
      await foundUser.save();

      await sendWelcomeEmail(foundUser.email, foundUser.name);

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
        user: {
          ...foundUser.toObject(),
          password: undefined,
        },
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: error });
  }
};

export const loginHandler = async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body as {
    emailOrUsername: string;
    password: string;
  };

  try {
    let user = null;
    user = await UserModel.findOne({ email: emailOrUsername });
    if (!user) {
      const usernameWithAt = `@${emailOrUsername}`;
      user = await UserModel.findOne({ username: usernameWithAt });
    }
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const userId = (user._id as ObjectId).toString();
    const role = user.role;
    // jwt
    const accessToken = jwt.sign({ userId, role }, JWT_SECRET_ACCESS, {
      expiresIn: "1m",
    });

    const refreshToken = jwt.sign({ userId, role }, JWT_SECRET_REFRESH, {
      expiresIn: "30d",
    });
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user.toObject(),
        password: undefined,
      },
      accessToken,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: error });
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
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
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
    console.log(error);

    res.status(500).json({ success: false, message: error });
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expared reset token" });
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
    console.log(error);

    res.status(500).json({ success: false, message: error });
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies.jwt) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized d" });
    }

    const refreshToken = cookies.jwt;

    const decodedJwt = jwt.verify(refreshToken, JWT_SECRET_REFRESH);
    if (typeof decodedJwt !== "object")
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized e" });

    const userId = decodedJwt.userId as string;
    const userIdObjectId = ObjectId.createFromHexString(userId);
    const foundUser = await UserModel.findOne(userIdObjectId);

    if (!foundUser)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized f" });

    const role = foundUser.role;

    const accessToken = jwt.sign({ userId, role }, JWT_SECRET_ACCESS, {
      expiresIn: "15m",
    });

    res.status(200).json({
      user: { ...foundUser.toObject(), password: undefined },
      accessToken,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: error });
  }
};

export async function sendEmailVerificationCodeHandler(
  req: Request,
  res: Response
) {
  try {
    const userId = req.params.userId;

    const userIdObjectId = ObjectId.createFromHexString(userId);

    const foundUser = await UserModel.findOne(userIdObjectId);
    if (!foundUser)
      return res.status(404).json({ success: false, message: "No user found" });

    const verificationToken = Math.floor(
      1000000 + Math.random() * 9000000
    ).toString();

    foundUser.verificationToken = verificationToken;
    foundUser.verificationTokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );
    await foundUser.save();
    await sendVerificationEmail(foundUser.email, verificationToken);

    return res
      .status(200)
      .json({ success: true, message: "Verification code sent to email" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
