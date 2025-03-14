import { ObjectId } from "mongodb";
import { UserModel } from "../../../../models/user.model";
import { PostModel } from "../../../../models/post.model";
import {
  CommentDocument,
  CommentModel,
} from "../../../../models/comment.model";
import CustomError from "../../../../constants/customError";

export async function editCommentDatabaseValidator({
  userId,
  postId,
  commentId,
}: {
  userId: ObjectId;
  postId: ObjectId;
  commentId: ObjectId;
}): Promise<CommentDocument> {
  const foundUser = await UserModel.findOne(userId);
  const foundPost = await PostModel.findOne(postId);
  const foundComment = await CommentModel.findOne(commentId);
  if (!foundUser) throw new CustomError(404, "User not found with such id");
  if (!foundPost) throw new CustomError(404, "Post not found with such id");
  if (!foundComment)
    throw new CustomError(404, "Comment not found with such id");

  return foundComment;
}
