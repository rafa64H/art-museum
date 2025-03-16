import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserModel } from "../models/user.model";
import { Request, Response } from "express";
import {
  createAccessToken,
  createRefreshToken,
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
import { JWT_SECRET_ACCESS, JWT_SECRET_REFRESH } from "../constants/env";
import { thirtyDaysFromNow } from "../utils/date";
import jwt from "jsonwebtoken";
import backendCheckValidityEmail from "../utils/form-input-validations/backendCheckValidityEmail";
import backendCheckValidityNameOrUsername from "../utils/form-input-validations/backendCheckValidityNameUsername";
import CustomError from "../constants/customError";
import signUpDatabaseValidator from "../utils/validation/database/auth-routes/signUpDatabaseValidator";
import {
  create1HourFromNowDate,
  create24HoursFromNowDate,
  create30DaysNumber,
} from "../utils/createDates";
import loginDatabaseValidator from "../utils/validation/database/auth-routes/loginDatabaseValidator";
import verifyEmailDatabaseValidator from "../utils/validation/database/auth-routes/verifyEmailDatabaseValidator";
import createEmailToken from "../utils/createToken";
import forgotPasswordDatabaseValidator from "../utils/validation/database/auth-routes/forgotPasswordDatabaseValidator";
import { validateAuthRoutesRequest } from "../utils/validation/joi/validateAuthRoutesRequestJoi";

export const signUpHandler = async (req: Request, res: Response) => {
  const { email, password, name, username } = req.body as unknown as {
    email: unknown;
    password: unknown;
    name: unknown;
    username: unknown;
  };
  validateAuthRoutesRequest({ email, password, name, username });

  const validatedEmail = email as string;
  const validatedPassword = password as string;
  const validatedName = name as string;
  const validatedUsername = username as string;

  const usernameWithoutSpaces = validatedUsername.replace(/\s/g, "");
  //If username doesn't have @ it will be added otherwise the username already has @
  let usernameWithAt = usernameWithoutSpaces;
  const doesUsernameHasAt = usernameWithoutSpaces.startsWith("@");
  if (!doesUsernameHasAt) usernameWithAt = `@${usernameWithoutSpaces}`;

  await signUpDatabaseValidator({
    email: validatedEmail,
    usernameWithAt,
  });

  const hashedPassword = await bcrypt.hash(validatedPassword, 10);
  const verificationToken = createEmailToken();
  const userDocument = new UserModel({
    email: validatedEmail,
    password: hashedPassword,
    name: validatedName,
    username: usernameWithAt,
    role: "user",
    verificationToken,
    verificationTokenExpiresAt: create24HoursFromNowDate(),
  });
  await userDocument.save();

  const userId = (userDocument._id as ObjectId).toString();
  const role = userDocument.role;

  // jwt
  const accessToken = createAccessToken({ userId, role });
  const refreshToken = createRefreshToken({ userId, role });
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: create30DaysNumber(),
  });

  // await sendVerificationEmail(user.email, verificationToken);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      ...userDocument.toObject(),
      password: undefined,
    },
    accessToken,
  });
};

export const loginHandler = async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body as {
    emailOrUsername: unknown;
    password: unknown;
  };

  validateAuthRoutesRequest({ loginObject: { emailOrUsername, password } });

  const validatedEmailOrUsername = emailOrUsername as string;
  const validatedPassword = password as string;

  const userDocument = await loginDatabaseValidator({
    emailOrUsername: validatedEmailOrUsername,
    password: validatedPassword,
  });

  const userId = (userDocument._id as ObjectId).toString();
  const role = userDocument.role;

  // jwt
  const accessToken = createAccessToken({ userId, role });
  const refreshToken = createRefreshToken({ userId, role });
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: create30DaysNumber(),
  });

  userDocument.lastLogin = new Date();
  await userDocument.save();

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: {
      ...userDocument.toObject(),
      password: undefined,
    },
    accessToken,
  });
};

export const verifyEmailHandler = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const code = req.params.code;
  validateAuthRoutesRequest({ verifyEmailObject: { userId, code } });

  const validatedCode = code as string;
  const validatedUserId = userId as string;

  const userDocument = await verifyEmailDatabaseValidator({
    code: validatedCode,
    userId: validatedUserId,
  });

  userDocument.verified = true;
  userDocument.changedEmail = false;
  userDocument.verificationToken = undefined;
  userDocument.verificationTokenExpiresAt = undefined;
  await userDocument.save();

  // await sendWelcomeEmail(userDocument.email, userDocument.name);

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    user: {
      ...userDocument.toObject(),
      password: undefined,
    },
  });
};

export const logoutHandler = async (req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPasswordHandler = async (req: Request, res: Response) => {
  const { emailOrUsername } = req.body as { emailOrUsername: unknown };

  validateAuthRoutesRequest({ emailOrUsername });

  const validatedEmailOrUsername = emailOrUsername as string;

  const userDocument = await forgotPasswordDatabaseValidator({
    emailOrUsername: validatedEmailOrUsername,
  });

  // Generate reset token
  const resetPasswordToken = createEmailToken();
  const resetTokenExpiresAt = create1HourFromNowDate(); // 1 hour
  userDocument.resetPasswordToken = resetPasswordToken;
  userDocument.resetPasswordExpiresAt = resetTokenExpiresAt;
  await userDocument.save();

  // send email
  await sendPasswordResetEmail(userDocument.email, resetPasswordToken);

  res.status(200).json({
    success: true,
    message: "Password reset code sent to your email",
  });
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  const { password, emailOrUsername, token } = req.body as {
    password: string;
    emailOrUsername: string;
    token: string;
  };

  console.log(password, emailOrUsername, token);

  let user = null;
  if (emailOrUsername.startsWith("@")) {
    user = await UserModel.findOne({ username: emailOrUsername });
  } else {
    user = await UserModel.findOne({ email: emailOrUsername });
  }
  if (!user) {
    throw new CustomError(400, "Invalid username or email input");
  }

  const resetPasswordExpiresAtDate = user.resetPasswordExpiresAt!;
  console.log(token === user.resetPasswordToken);
  console.log(token);
  console.log(user.resetPasswordToken);

  if (resetPasswordExpiresAtDate < new Date())
    throw new CustomError(400, "Verification token expired");
  if (token !== user.resetPasswordToken)
    throw new CustomError(400, "Invalid verification token");

  // update password
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresAt = undefined;
  await user.save();

  await sendResetSuccessEmail(user.email);

  res.status(200).json({ success: true, message: "Password reset successful" });
};

export const refreshHandler = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    throw new CustomError(401, "Unauthorized d");
  }

  const refreshToken = cookies.jwt;

  const decodedJwt = jwt.verify(refreshToken, JWT_SECRET_REFRESH);
  if (typeof decodedJwt !== "object")
    throw new CustomError(401, "Unauthorized e");

  const userId = decodedJwt.userId as string;
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);

  if (!foundUser) throw new CustomError(401, "Unauthorized f");

  const role = foundUser.role;

  const accessToken = jwt.sign({ userId, role }, JWT_SECRET_ACCESS, {
    expiresIn: "15m",
  });

  res.status(200).json({
    user: { ...foundUser.toObject(), password: undefined },
    accessToken,
  });
};

export async function sendEmailVerificationCodeHandler(
  req: Request,
  res: Response
) {
  const userId = req.params.userId;

  const userIdObjectId = ObjectId.createFromHexString(userId);

  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser) throw new CustomError(404, "No user found");

  const verificationToken = Math.floor(
    1000000 + Math.random() * 9000000
  ).toString();

  foundUser.verificationToken = verificationToken;
  foundUser.verificationTokenExpiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );
  await foundUser.save();
  await sendVerificationEmail(foundUser.email, verificationToken, userId);

  return res.status(200).json({
    success: true,
    message: "Verification code sent to email",
  });
}
