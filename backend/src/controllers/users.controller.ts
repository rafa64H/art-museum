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
  const userId = req.userId;
  const { password, newPassword } = req.body as {
    password: unknown;
    newPassword: unknown;
  };

  validateUsersRoutesRequest({ userId, loginPassword: password, newPassword });

  const validatedUserId = userId as string;
  const validatedPassword = password as string;
  const validatedNewPassword = newPassword as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);

  const foundUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true
  )) as UserDocument;

  const validDialogPassword = await bcrypt.compare(
    validatedPassword,
    foundUser.password
  );

  if (!validDialogPassword) throw new CustomError(401, "Wrong password");

  const newHashedPassword = await bcrypt.hash(validatedNewPassword, 10);
  await foundUser.updateOne({ $set: { password: newHashedPassword } });

  res.status(200).json({ success: true, message: "User password changed" });
}

export async function getFollowersFromUser(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userIdMiddleware = req.userId as unknown;
  const userId = req.params.userId;

  validateUsersRoutesRequest({ userId: userId });
  validateUsersRoutesRequest({ userId: userIdMiddleware });

  const validatedUserId = userId as string;
  const validatedUserIdMiddleware = userIdMiddleware as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const userIdMiddlewareObjectId = ObjectId.createFromHexString(
    validatedUserIdMiddleware
  );
  const foundUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true
  )) as UserDocument;

  if (validatedUserId === validatedUserIdMiddleware)
    throw new CustomError(
      401,
      "Not the same authenticated user as the user in param"
    );

  const objectUser = foundUser.toObject();

  let followers: {}[] = [];

  for (let index = 0; index < objectUser.followers.length; index++) {
    const idFromFollowersObjectId = ObjectId.createFromHexString(
      objectUser.followers[index]
    );

    const userFromFollowers = await UserModel.findOne(idFromFollowersObjectId);

    if (!userFromFollowers) return null;

    const userFromFollowersObject = userFromFollowers.toObject();

    followers.push({ ...userFromFollowersObject, password: undefined });
  }

  res.status(200).json({ success: true, followers });
}

export async function getFollowingFromUser(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userIdMiddleware = req.userId as unknown;
  const userId = req.params.userId;

  validateUsersRoutesRequest({ userId: userId });
  validateUsersRoutesRequest({ userId: userIdMiddleware });

  const validatedUserId = userId as string;
  const validatedUserIdMiddleware = userIdMiddleware as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const userIdMiddlewareObjectId = ObjectId.createFromHexString(
    validatedUserIdMiddleware
  );
  const foundUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true
  )) as UserDocument;

  if (validatedUserId === validatedUserIdMiddleware)
    throw new CustomError(
      401,
      "Not the same authenticated user as the user in param"
    );

  const objectUser = foundUser.toObject();

  let following: {}[] = [];

  for (let index = 0; index < objectUser.following.length; index++) {
    const idFromFollowingObjectId = ObjectId.createFromHexString(
      objectUser.following[index]
    );

    const userFromFollowing = await UserModel.findOne(idFromFollowingObjectId);

    if (!userFromFollowing) return null;

    const userFromFollowingObject = userFromFollowing.toObject();

    following.push({ ...userFromFollowingObject, password: undefined });
  }

  res.status(200).json({ success: true, following });
}
export async function addOrRemoveFollowerHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.params.userId;
  const userIdTheOtherUser = req.userId as unknown;
  validateUsersRoutesRequest({ userId });
  validateUsersRoutesRequest({ userId: userIdTheOtherUser });

  const validatedUserId = userId as string;
  const validatedUserIdTheOtherUser = userIdTheOtherUser as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const userIdObjectIdRequest = ObjectId.createFromHexString(
    validatedUserIdTheOtherUser
  );

  const userDocument = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true
  )) as UserDocument;
  const otherUserDocument = (await databaseValidateUserIdObjectId(
    userIdObjectIdRequest,
    true
  )) as UserDocument;

  const userAlreadyIsBeingFollowedByOtherUser = userDocument.followers.includes(
    validatedUserIdTheOtherUser
  );

  if (userAlreadyIsBeingFollowedByOtherUser) {
    await userDocument.updateOne({
      $pull: { followers: validatedUserIdTheOtherUser },
    });
    await otherUserDocument.updateOne({
      $pull: { following: validatedUserId },
    });
    return res.status(200).json({
      success: true,
      message: `${userDocument.username} do not have follower ${otherUserDocument.username}`,
    });
  }

  await userDocument.updateOne({
    $push: { followers: validatedUserIdTheOtherUser },
  });
  await otherUserDocument.updateOne({
    $push: { following: validatedUserId },
  });

  res.status(200).json({
    success: true,
    message: `${userDocument.username} is being followed by ${otherUserDocument.username}`,
  });
}

export async function addOrRemoveFollowingHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.params.userId;
  const userIdTheOtherUser = req.userId as unknown;
  validateUsersRoutesRequest({ userId });
  validateUsersRoutesRequest({ userId: userIdTheOtherUser });

  const validatedUserId = userId as string;
  const validatedUserIdTheOtherUser = userIdTheOtherUser as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);
  const userIdObjectIdRequest = ObjectId.createFromHexString(
    validatedUserIdTheOtherUser
  );

  const userDocument = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true
  )) as UserDocument;
  const otherUserDocument = (await databaseValidateUserIdObjectId(
    userIdObjectIdRequest,
    true
  )) as UserDocument;

  const userAlreadyFollowingOtherUser = userDocument.followers.includes(
    validatedUserIdTheOtherUser
  );

  if (userAlreadyFollowingOtherUser) {
    await userDocument.updateOne({
      $pull: { following: validatedUserIdTheOtherUser },
    });
    await otherUserDocument.updateOne({
      $pull: { followers: validatedUserId },
    });
    return res.status(200).json({
      success: true,
      message: `${userDocument.username} is not following ${otherUserDocument.username}`,
    });
  }

  await userDocument.updateOne({
    $push: { following: validatedUserIdTheOtherUser },
  });
  await otherUserDocument.updateOne({
    $push: { followers: validatedUserId },
  });

  res.status(200).json({
    success: true,
    message: `${userDocument.username} is following ${otherUserDocument.username}`,
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
