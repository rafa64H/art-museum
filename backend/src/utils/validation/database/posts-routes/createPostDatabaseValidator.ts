import { ObjectId } from "mongodb";
import { UserModel } from "../../../../models/user.model";
import { PostDocument, PostModel } from "../../../../models/post.model";
import CustomError from "../../../../constants/customError";

export default async function createPostDatabaseValidator({
  userId,
  title,
  content,
  tags,
}: {
  userId: string;
  title: string;
  content: string;
  tags: string[];
}) {
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser) throw new CustomError(404, "User not found with such id");
}
