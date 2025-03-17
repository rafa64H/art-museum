import CustomError from "../../../../constants/customError";
import { UserDocument } from "../../../../models/user.model";

export default async function resetPasswordDatabaseValidator(
  userDocument: UserDocument,
  token: string
) {
  if (userDocument.resetPasswordExpiresAt === undefined)
    throw new CustomError(404, "No token found for user");
  if (userDocument.resetPasswordToken !== token)
    throw new CustomError(400, "Invalid token");
  if (userDocument.resetPasswordExpiresAt < new Date())
    throw new CustomError(400, "Expired token");
}
