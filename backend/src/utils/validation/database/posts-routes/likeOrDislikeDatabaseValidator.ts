import { ObjectId } from "mongodb";
import { PostDocument } from "../../../../models/post.model";
import { UserModel } from "../../../../models/user.model";
import { PostModel } from "../../../../models/post.model";
import CustomError from "../../../../constants/customError";

export default async function likeOrDislikeDatabaseValidator({
  postId,
  userId,
}: {
  postId: ObjectId;
  userId: ObjectId;
}): Promise<PostDocument> {
  const foundUser = await UserModel.findOne(userId);
  if (!foundUser) throw new CustomError(404, "User not found with such id");
  const foundPost = await PostModel.findOne(postId);
  if (!foundPost) throw new CustomError(404, "Post not found with such id");

  return foundPost;
}
