import bcrypt from "bcrypt";
import { UserDocument } from "../../../../models/user.model";
import CustomError from "../../../../constants/customError";

//For now this will make updates too, I want to change the logic
//when changing email
export default async function databaseValidateEditAccountInfo({
  userDocument,
  password,
  newEmail,
  newName,
  newUsernameWithAt,
}: {
  userDocument: UserDocument;
  password: string;
  newEmail: string | null;
  newName: string | null;
  newUsernameWithAt: string | null;
}) {
  const validVerifyPassword = await bcrypt.compare(
    password,
    userDocument.password
  );
  if (!validVerifyPassword) {
    throw new CustomError(401, "Wrong password");
  }

  if (newEmail && newEmail !== userDocument.email) {
    if (!userDocument.verified)
      throw new CustomError(
        403,
        "You need to verify your email before changing it"
      );
    if (!(newEmail === userDocument.email)) {
      await userDocument.updateOne({
        $set: {
          email: newEmail,
          verified: false,
        },
      });
    }
  }

  if (newName && newName !== userDocument.name) {
    console.log(newName, 2);
    await userDocument.updateOne({ $set: { name: newName } });
  }

  if (newUsernameWithAt && newUsernameWithAt !== userDocument.username) {
    await userDocument.updateOne({ $set: { username: newUsernameWithAt } });
  }
}
