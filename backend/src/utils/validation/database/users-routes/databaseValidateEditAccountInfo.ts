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
  const validDialogPassword = await bcrypt.compare(
    password,
    userDocument.password
  );
  if (!validDialogPassword) {
    throw new CustomError(401, "Wrong password");
  }

  if (newEmail && newEmail !== userDocument.email) {
    if (!(newEmail === userDocument.email) && !userDocument.changedEmail) {
      await userDocument.updateOne({
        $set: {
          previousEmail: userDocument.email,
          email: newEmail,
          previousEmailVerified: userDocument.verified,
          verified: false,
          changedEmail: true,
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
