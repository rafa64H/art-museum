import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserDocument, UserModel } from "../models/user.model";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
import backendCheckValidityEmail from "../utils/form-input-validations/backendCheckValidityEmail";
import backendCheckValidityNameOrUsername from "../utils/form-input-validations/backendCheckValidityNameUsername";
import CustomError from "../constants/customError";
import { validateUsersRoutesRequest } from "../utils/validation/joi/validateUsersRoutesRequestJoi";
import databaseValidateUserIdObjectId from "../utils/validation/database/databaseValidateUserIdObjectId";
import databaseValidateEditAccountInfo from "../utils/validation/database/users-routes/databaseValidateEditAccountInfo";
import checkOrChangeIfUsernameHasAt from "../utils/checkOrChangeIfUsernameHasAt";

export async function getAllUsersHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const users = await UserModel.find();
  const usersWithoutPassword = users.map((user) => {
    return { ...user.toObject(), password: undefined };
  });

  res.status(200).json({ success: true, users: usersWithoutPassword });
}

export async function getUserHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  validateUsersRoutesRequest({ userId });
  const validatedUserId = userId as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const foundUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true
  )) as UserDocument;

  res.status(200).json({
    success: true,
    user: { ...foundUser.toObject(), password: undefined },
  });
}

export async function editUserHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  const { password, newEmail, newName, newUsername } = req.body as {
    password: unknown;
    newEmail: unknown;
    newName: unknown;
    newUsername: unknown;
  };

  validateUsersRoutesRequest({
    userId,
    loginPassword: password,
    email: newEmail,
    name: newName,
    username: newUsername,
  });

  const validatedUserId = userId as string;
  const validatedPassword = password as string;
  const validatedNewEmail = newEmail as string;
  const validatedNewName = newUsername as string;
  const validatedNewUsername = newUsername as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);

  const foundUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true
  )) as UserDocument;

  const validDialogPassword = await bcrypt.compare(
    validatedPassword,
    foundUser.password
  );
  if (!validDialogPassword) {
    throw new CustomError(401, "Wrong password");
  }

  const newUsernameWithAt = checkOrChangeIfUsernameHasAt(validatedNewUsername);

  await databaseValidateEditAccountInfo({
    userDocument: foundUser,
    password: validatedPassword,
    newEmail: validatedNewEmail,
    newName: validatedNewName,
    newUsernameWithAt,
  });

  res.status(200).json({
    success: true,
    user: { ...foundUser.toObject(), password: undefined },
    message: "User account edited",
  });
}

export async function changePasswordHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  if (!req.userId) throw new CustomError(401, "Unauthorized");
  const userIdObjectId = ObjectId.createFromHexString(req.userId);

  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser) throw new CustomError(401, "Unauthorized");

  const { password, newPassword } = req.body as {
    password: string;
    newPassword: string;
  };

  let hashedPassword = null;

  if (newPassword) {
    const validDialogPassword = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!validDialogPassword) throw new CustomError(401, "Wrong password");

    hashedPassword = await bcrypt.hash(newPassword, 10);
    foundUser.password = hashedPassword ? hashedPassword : foundUser.password;
    await foundUser.save();

    res.status(200).json({ success: true, message: "User password changed" });
  }
}

export async function getFollowersFollowingFromUser(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userIdMiddleware = req.userId;
  if (!userIdMiddleware) throw new CustomError(401, "Unauthorized");
  const userId = req.params.userId;
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);

  if (!foundUser) throw new CustomError(404, "User not found with such id");

  if (!((foundUser._id as string).toString() === userIdMiddleware))
    throw new CustomError(
      401,
      "Not the same authenticated user as the user in param"
    );

  const objectUser = foundUser.toObject();

  let following: {}[] = [];

  let followers: {}[] = [];

  for (let index = 0; index < objectUser.following.length; index++) {
    const idFromFollowingObjectId = ObjectId.createFromHexString(
      objectUser.following[index]
    );

    const userFromFollowing = await UserModel.findOne(idFromFollowingObjectId);

    if (!userFromFollowing) return null;

    const userFromFollowingObject = userFromFollowing.toObject();

    following.push({ ...userFromFollowingObject, password: undefined });
  }

  for (let index = 0; index < objectUser.followers.length; index++) {
    const idFromFollowersObjectId = ObjectId.createFromHexString(
      objectUser.followers[index]
    );

    const userFromFollowers = await UserModel.findOne(idFromFollowersObjectId);

    if (!userFromFollowers) return null;

    const userFromFollowersObject = userFromFollowers.toObject();

    followers.push({ ...userFromFollowersObject, password: undefined });
  }

  res
    .status(200)
    .json({ success: true, following: following, followers: followers });
}
export async function addFollowerHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.params.userId;
  const userIdRequest = req.userId as string;

  const userIdObjectId = ObjectId.createFromHexString(userId);
  const userIdObjectIdRequest = ObjectId.createFromHexString(userIdRequest);

  const foundUser = await UserModel.findOne(userIdObjectId);
  const userRequest = await UserModel.findOne(userIdObjectIdRequest);

  if (!foundUser) throw new CustomError(404, "User not found with such id");
  if (!userRequest) throw new CustomError(401, "Unauthorized");

  foundUser.followers = [...foundUser.followers, userIdRequest];
  userRequest.following = [...foundUser.following, userId];

  await foundUser.save();
  await userRequest.save();

  res.status(200).json({
    success: true,
    message: `${userRequest.username} now following ${foundUser.username}`,
    userRequestFollowing: userRequest.following,
    foundUserFollowers: foundUser.followers,
  });
}

export async function deleteFollowerHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.params.userId;
  const userIdRequest = req.userId as string;

  const userIdObjectId = ObjectId.createFromHexString(userId);
  const userIdObjectIdRequest = ObjectId.createFromHexString(userIdRequest);

  const foundUser = await UserModel.findOne(userIdObjectId);
  const userRequest = await UserModel.findOne(userIdObjectIdRequest);

  if (!foundUser) throw new CustomError(404, "User not found with such id");
  if (!userRequest) throw new CustomError(401, "Unauthorized");

  const indexFollower = foundUser.followers.indexOf(userIdRequest);
  const indexFollowing = userRequest.following.indexOf(userId);

  if (indexFollower === -1 || indexFollowing === -1) {
    throw new CustomError(404, "User not found as follower or follow");
  }

  foundUser.followers.splice(indexFollower, 1);
  userRequest.following.splice(indexFollowing, 1);
  await foundUser.save();
  await userRequest.save();

  res.status(200).json({
    success: true,
    message: `${userRequest.username} unfollowed ${foundUser.username}`,
    userRequestFollowing: userRequest.following,
    foundUserFollowers: foundUser.followers,
  });
}

export async function undoEmailChangeHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  console.log(userId);
  if (!userId) throw new CustomError(401, "Unauthorized");
  const userIdObjectId = ObjectId.createFromHexString(userId);

  const foundUser = await UserModel.findOne(userIdObjectId);
  console.log(foundUser);
  if (!foundUser) throw new CustomError(401, "Unauthorized");

  if (!foundUser.previousEmail)
    throw new CustomError(400, "User does not have previous email");

  foundUser.email = foundUser.previousEmail;
  foundUser.verified = foundUser.previousEmailVerified;
  foundUser.changedEmail = false;
  foundUser.previousEmail = null;
  await foundUser.save();

  res
    .status(200)
    .json({ success: true, message: "Email change undid successfully" });
}
