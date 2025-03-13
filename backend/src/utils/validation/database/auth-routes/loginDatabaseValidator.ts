import bcrypt from "bcrypt";
import { UserDocument, UserModel } from "../../../../models/user.model";
import CustomError from "../../../../constants/customError";
export default async function loginDatabaseValidator({
  emailOrUsername,
  password,
}: {
  emailOrUsername: string;
  password: string;
}): Promise<UserDocument> {
  let user: UserDocument | null = null;
  //Try using string as email
  user = await UserModel.findOne({ email: emailOrUsername });

  //Try using string as username
  if (!user) {
    const usernameWithAt = `@${emailOrUsername}`;
    user = await UserModel.findOne({ username: usernameWithAt });
  }
  if (!user) {
    throw new CustomError(400, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new CustomError(400, "Invalid credentials");
  }

  return user;
}
