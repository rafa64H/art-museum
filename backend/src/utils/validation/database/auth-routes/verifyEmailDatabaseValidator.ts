import { ObjectId } from "mongodb";
import { UserDocument, UserModel } from "../../../../models/user.model";
import CustomError from "../../../../constants/customError";

export default async function verifyEmailDatabaseValidator({
  userDocument,
  code,
}: {
  userDocument: UserDocument;
  code: string;
}) {
  if (userDocument.verificationTokenExpiresAt === undefined)
    throw new CustomError(404, "No token found for user");
  if (userDocument.verificationToken !== code)
    throw new CustomError(400, "Invalid code");
  if (userDocument.verificationTokenExpiresAt < new Date())
    throw new CustomError(400, "Expired code");
}
