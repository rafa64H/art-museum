import { ObjectId } from "mongodb";
import { UserModel } from "../../../../models/user.model";
import { PostDocument, PostModel } from "../../../../models/post.model";

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
}): Promise<string | null> {
  const userIdObjectId = ObjectId.createFromHexString(userId);
  const foundUser = await UserModel.findOne(userIdObjectId);
  if (!foundUser) return "User not found with such id";

  return null;
}
