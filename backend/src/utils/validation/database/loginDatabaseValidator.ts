import { UserDocument, UserModel } from "../../../models/user.model";
import bcrypt from "bcrypt";
export default async function loginDatabaseValidator({
  emailOrUsername,
  password,
}: {
  emailOrUsername: string;
  password: string;
}): Promise<UserDocument | string> {
  let user: UserDocument | null = null;
  //Try using string as email
  user = await UserModel.findOne({ email: emailOrUsername });

  //Try using string as username
  if (!user) {
    const usernameWithAt = `@${emailOrUsername}`;
    user = await UserModel.findOne({ username: usernameWithAt });
  }
  if (!user) {
    return "Invalid credentials";
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return "Invalid credentials";
  }

  return user;
}
