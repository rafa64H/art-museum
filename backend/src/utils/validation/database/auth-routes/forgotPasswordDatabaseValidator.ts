import CustomError from "../../../../constants/customError";
import { UserDocument, UserModel } from "../../../../models/user.model";

export default async function forgotPasswordDatabaseValidator({
  emailOrUsername,
}: {
  emailOrUsername: string;
}): Promise<UserDocument> {
  let user = null;
  if (emailOrUsername.startsWith("@")) {
    user = await UserModel.findOne({ username: emailOrUsername });
  } else {
    user = await UserModel.findOne({ email: emailOrUsername });
  }
  if (!user) {
    throw new CustomError(400, "User not found with such email or username");
  }

  return user;
}
