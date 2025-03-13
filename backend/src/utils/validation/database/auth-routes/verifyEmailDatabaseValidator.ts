import { ObjectId } from "mongodb";
import { UserDocument, UserModel } from "../../../../models/user.model";
import CustomError from "../../../../constants/customError";

export default async function verifyEmailDatabaseValidator({
  userId,
  code,
}: {
  userId: string;
  code: string;
}): Promise<UserDocument> {
  const userIdObjectId = ObjectId.createFromHexString(userId);

  const foundUser = (await UserModel.findOne(userIdObjectId)) as UserDocument;

  if (!foundUser) {
    throw new CustomError(404, "User not found with such id");
  }

  if (foundUser.verificationTokenExpiresAt === undefined)
    throw new CustomError(404, "No token found for user");
  if (foundUser.verificationToken !== code)
    throw new CustomError(400, "Invalid code");
  if (foundUser.verificationTokenExpiresAt < new Date())
    throw new CustomError(400, "Expired code");

  return foundUser;
}
