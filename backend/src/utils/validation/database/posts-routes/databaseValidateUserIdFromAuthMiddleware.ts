import { ObjectId } from "mongodb";
import { UserDocument, UserModel } from "../../../../models/user.model";
import CustomError from "../../../../constants/customError";

export default async function databaseValidateUserIdFromAuthMiddleware(
  userId: ObjectId,
  returnUser: boolean
): Promise<UserDocument | undefined> {
  const findUser = await UserModel.findOne(userId);

  if (!findUser) throw new CustomError(404, "User not found");

  if (returnUser) {
    return findUser;
  }
}
