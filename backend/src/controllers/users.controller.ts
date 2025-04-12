import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserDocument, UserModel } from "../models/user.model";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
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
    passedUserId: true,
    passedLoginPassword: true,
    passedEmail: true,
    passedName: true,
    passedUsername: true,
  });

  const validatedUserId = userId as string;
  const validatedPassword = password as string;
  const validatedNewEmail = newEmail as string;
  const validatedNewName = newName as string;
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

  const editedUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true
  )) as UserDocument;

  res.status(200).json({
    success: true,
    user: { ...editedUser.toObject(), password: undefined },
    message: "User account edited",
  });
}

export async function changePasswordHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  const userId = req.userId;
  const { password, newPassword, confirmNewPassword } = req.body as {
    password: unknown;
    newPassword: unknown;
    confirmNewPassword: unknown;
  };

  validateUsersRoutesRequest({
    userId,
    password: newPassword,
    confirmPassword: confirmNewPassword,
    loginPassword: password,
    passedUserId: true,
    passedPassword: true,
    passedConfirmPassword: true,
    passedLoginPassword: true,
  });

  const validatedUserId = userId as string;
  const validatedPassword = password as string;
  const validatedConfirmNewPassword = confirmNewPassword as string;
  const validatedNewPassword = newPassword as string;

  const userIdObjectId = ObjectId.createFromHexString(validatedUserId);

  const foundUser = (await databaseValidateUserIdObjectId(
    userIdObjectId,
    true
  )) as UserDocument;

  const validVerifyPassword = await bcrypt.compare(
    validatedPassword,
    foundUser.password
  );

  if (!validVerifyPassword) throw new CustomError(401, "Wrong password");

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
