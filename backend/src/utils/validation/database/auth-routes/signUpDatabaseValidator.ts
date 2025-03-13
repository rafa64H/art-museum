import CustomError from "../../../../constants/customError";
import { UserModel } from "../../../../models/user.model";

export default async function signUpDatabaseValidator({
  email,
  usernameWithAt,
}: {
  email: string;
  usernameWithAt: string;
}): Promise<string | null> {
  const alreadyUsedEmail = await UserModel.findOne({ email });
  const alreadyUsedUsername = await UserModel.findOne({ usernameWithAt });
  if (alreadyUsedEmail) {
    return "Email already in use";
  }
  if (alreadyUsedUsername) {
    return "Username already in use";
  }

  return null;
}
