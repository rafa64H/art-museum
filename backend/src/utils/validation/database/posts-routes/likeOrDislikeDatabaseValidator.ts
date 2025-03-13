import { ObjectId } from "mongodb";
import { PostDocument } from "../../../../models/post.model";
import { UserModel } from "../../../../models/user.model";
import { PostModel } from "../../../../models/post.model";

export default async function likeOrDislikeDatabaseValidator({
  postId,
  userId,
}: {
  postId: ObjectId;
  userId: ObjectId;
}): Promise<PostDocument | string> {
  const foundUser = await UserModel.findOne(userId);
  if (!foundUser) return "User not found with such id";
  const foundPost = await PostModel.findOne(postId);
  if (!foundPost) return "Post not found with such id";

  return foundPost;
}
