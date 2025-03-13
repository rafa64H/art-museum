import CustomError from "../../../../constants/customError";
import { UserModel } from "../../../../models/user.model";

export default async function signUpDatabaseValidator({
  email,
  usernameWithAt,
}: {
  email: string;
  usernameWithAt: string;
}) {
  const alreadyUsedEmail = await UserModel.findOne({ email });
  const alreadyUsedUsername = await UserModel.findOne({ usernameWithAt });
  if (alreadyUsedEmail) {
    throw new CustomError(400, "Email already in use");
  }
  if (alreadyUsedUsername) {
    throw new CustomError(400, "Username already in use");
  }
}
