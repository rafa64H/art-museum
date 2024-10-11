import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../models/user.model";
import { Request, Response } from "express";
import { generateTokenAndSetCookie } from "../utils/generateJWTAndSetCookie";
import { sendVerificationEmail } from "../services/mailtrap/mailtrap";
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
