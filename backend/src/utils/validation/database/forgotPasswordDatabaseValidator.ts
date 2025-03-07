import { UserDocument, UserModel } from "../../../models/user.model";

export default async function forgotPasswordDatabaseValidator({
  emailOrUsername,
}: {
  emailOrUsername: string;
}): Promise<UserDocument | string> {
  let user = null;
  if (emailOrUsername.startsWith("@")) {
    user = await UserModel.findOne({ username: emailOrUsername });
  } else {
    user = await UserModel.findOne({ email: emailOrUsername });
  }
  if (!user) {
    return "Invalid email or username input";
  }

  return user;
}
