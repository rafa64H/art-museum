import { ObjectId } from "mongodb";
import { UserDocument, UserModel } from "../../../../models/user.model";

export default async function verifyEmailDatabaseValidator({
  userId,
  code,
}: {
  userId: string;
  code: string;
}): Promise<UserDocument | string> {
  const userIdObjectId = ObjectId.createFromHexString(userId);

  const foundUser = (await UserModel.findOne(userIdObjectId)) as UserDocument;

  if (!foundUser) {
    return "Invalid link";
  }

  if (foundUser.verificationTokenExpiresAt === undefined)
    return "No token available";
  if (foundUser.verificationToken !== code) return "Invalid code";
  if (foundUser.verificationTokenExpiresAt < new Date()) return "Expired code";

  return foundUser;
}
