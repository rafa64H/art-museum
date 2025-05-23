import bcrypt from "bcrypt";
import { UserDocument, UserModel } from "../models/user.model";
import { Request, Response } from "express";
import { createAccessToken, createRefreshToken } from "../utils/jwtFunctions";
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
import resetPasswordDatabaseValidator from "../utils/validation/database/auth-routes/resetPasswordDatabaseValidator";
import databaseValidateUserIdObjectId from "../utils/validation/database/databaseValidateUserIdObjectId";
import checkOrChangeIfUsernameHasAt from "../utils/checkOrChangeIfUsernameHasAt";

export const signUpHandler = async (req: Request, res: Response) => {
  const { email, password, confirmPassword, name, username } = req.body as {
    email: unknown;
    password: unknown;
    confirmPassword: unknown;
    name: unknown;
    username: unknown;
  };

  validateAuthRoutesRequest({
    email,
    password,
    confirmPassword,
    name,
    username,
    passedEmail: true,
    passedPassword: true,
    passedConfirmPassword: true,
    passedName: true,
    passedUsername: true,
  });

  const validatedEmail = email as string;
  const validatedPassword = password as string;
  const validatedConfirmPassword = confirmPassword as string;
  const validatedName = name as string;
  const validatedUsername = username as string;

  const usernameWithAt = checkOrChangeIfUsernameHasAt(validatedUsername);

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
    verified: true,
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

  validateAuthRoutesRequest({
    loginObject: { emailOrUsername, password },
    passedLoginObject: true,
  });

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

  await userDocument.updateOne({ $set: { lastLogin: new Date() } });

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
  validateAuthRoutesRequest({
    verifyEmailOrResetPasswordObject: { userId, code },
    passedVerifyEmailOrResetPasswordObject: true,
  });

  const validatedCode = code as string;
  const validatedUserId = userId as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);

  const userDocument = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true
  )) as UserDocument;
  await verifyEmailDatabaseValidator({
    code: validatedCode,
    userDocument,
  });

  await userDocument.updateOne({
    $set: {
      verified: true,
      verificationToken: undefined,
      verificationTokenExpiresAt: undefined,
    },
  });

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

  validateAuthRoutesRequest({ emailOrUsername, passedEmailOrUsername: true });

  const validatedEmailOrUsername = emailOrUsername as string;

  const userDocument = await forgotPasswordDatabaseValidator({
    emailOrUsername: validatedEmailOrUsername,
  });

  const resetPasswordToken = createEmailToken();
  const resetTokenExpiresAt = create1HourFromNowDate();
  await userDocument.updateOne({
    $set: {
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpiresAt: resetTokenExpiresAt,
    },
  });

  await sendPasswordResetEmail(
    userDocument.email,
    resetPasswordToken,
    (userDocument._id as ObjectId).toString()
  );

  res.status(200).json({
    success: true,
    message: "Password reset code sent to your email",
  });
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
  const { password } = req.body as {
    password: unknown;
  };

  const token = req.params.token;
  const userId = req.params.userId;

  validateAuthRoutesRequest({
    password,
    verifyEmailOrResetPasswordObject: { userId, code: token },
    passedPassword: true,
    passedVerifyEmailOrResetPasswordObject: true,
  });

  const validatedPassword = password as string;

  const userIdObjectId = ObjectId.createFromHexString(userId);

  const user = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true
  )) as UserDocument;

  await resetPasswordDatabaseValidator(user, token);

  // update password
  const hashedPassword = await bcrypt.hash(validatedPassword, 10);
  user.updateOne({
    $set: {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpiresAt: undefined,
    },
  });

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

  validateAuthRoutesRequest({ userId, passedUserId: true });

  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true
  )) as UserDocument;

  const verificationToken = createEmailToken();
  const verificationTokenExpiresAt = create24HoursFromNowDate();
  await foundUser.updateOne({
    $set: {
      verificationToken: verificationToken,
      verificationTokenExpiresAt: verificationTokenExpiresAt,
    },
  });

  await sendVerificationEmail(foundUser.email, verificationToken, userId);

  return res.status(200).json({
    success: true,
    message: "Verification code sent to email",
  });
}
