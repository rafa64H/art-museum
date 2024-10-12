import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../models/user.model";
import { Request, Response } from "express";
import { generateTokenAndSetCookie } from "../utils/generateJWTAndSetCookie";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../services/mailtrap/mailtrap";
import { ObjectId } from "mongodb";

class ErrorReturn extends Error {
  constructor(public status: number, public message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

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

    const alreadyUsedEmail = await User.findOne({ email });
    const alreadyUsedUsername = await User.findOne({ username });

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

    const user = new User({
      email,
      password: hashedPassword,
      name,
      username,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    const userId = user._id as ObjectId;

    // jwt
    generateTokenAndSetCookie(res, userId);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
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

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const { code, userId } = req.body as { code: string; userId: ObjectId };
  try {
    const user = await User.findOne({
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
      user = await User.findOne({ username: emailOrUsername });
    } else {
      user = await User.findOne({ email: emailOrUsername });
    }

    if (!user) {
      throw new ErrorReturn(400, "Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ErrorReturn(400, "Invalid credentials");
    }

    const userId = user._id as ObjectId;

    generateTokenAndSetCookie(res, userId);

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
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
