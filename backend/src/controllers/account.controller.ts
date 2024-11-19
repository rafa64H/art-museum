import bcrypt from "bcrypt";
import { Response } from "express";
import { AuthMiddlewareRequest } from "../middleware/verifyJWT";
import { UserModel } from "../models/user.model";
import { ObjectId } from "mongodb";

export async function editAccountHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  try {
    if (!req.userId)
      return res.status(401).json({
        success: false,
        message: "Error editing account: Unauthorized",
      });

    const userIdObjectId = ObjectId.createFromHexString(req.userId);

    const foundUser = await UserModel.findOne(userIdObjectId);

    if (!foundUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const { password, newEmail, newName, newUsername } = req.body as {
      password: string | null;
      newEmail: string | null;
      newName: string | null;
      newUsername: string | null;
    };

    if (!password)
      return res
        .status(401)
        .json({ success: false, message: "Wrong current password" });

    console.log(password);
    const validDialogPassword = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!validDialogPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong current password" });
    }

    foundUser.email = newEmail ? newEmail : foundUser.email;
    foundUser.name = newName ? newName : foundUser.name;
    foundUser.username = newUsername ? newUsername : foundUser.username;

    await foundUser.save();

    const userToReturn = foundUser;

    res.status(200).json({
      success: true,
      user: { ...foundUser.toObject(), password: undefined },
      message: "User account edited",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
}

export async function changePasswordHandler(
  req: AuthMiddlewareRequest,
  res: Response
) {
  if (!req.userId)
    return res.status(401).json({
      success: false,
      message: "Error editing account: Unauthorized",
    });

  const userIdObjectId = ObjectId.createFromHexString(req.userId);

  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser)
    return res.status(404).json({ success: false, message: "User not found" });

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

    if (!validDialogPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong current password" });
    }

    hashedPassword = await bcrypt.hash(newPassword, 10);
    foundUser.password = hashedPassword ? hashedPassword : foundUser.password;
    await foundUser.save();

    res.status(200).json({ success: true, message: "User password changed" });
  }
}
