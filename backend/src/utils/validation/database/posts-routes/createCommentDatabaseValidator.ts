import { ObjectId } from "mongodb";
import { UserModel } from "../../../../models/user.model";
import { PostModel } from "../../../../models/post.model";
import CustomError from "../../../../constants/customError";

export default async function createCommentDatabaseValidator({
  userId,
  postId,
}: {
  userId: ObjectId;
  postId: ObjectId;
}) {
  const foundUser = await UserModel.findOne(userId);
  const foundPost = await PostModel.findOne(postId);

  if (!foundUser) throw new CustomError(404, "User not found with such id");
  if (!foundPost) throw new CustomError(404, "Post not found with such id");
}
