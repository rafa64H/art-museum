import { ObjectId } from "mongodb";
import CustomError from "../../../../constants/customError";
import { PostModel } from "../../../../models/post.model";
import { CommentModel } from "../../../../models/comment.model";

export default async function getAllRepliesFromCommentDatabaseValidator({
  postId,
  commentId,
}: {
  postId: ObjectId;
  commentId: ObjectId;
}) {
  const foundPost = await PostModel.findOne(postId);
  const foundComment = await CommentModel.findOne(commentId);

  if (!foundPost) throw new CustomError(404, "Post not found with such id");

  if (!foundComment)
    throw new CustomError(404, "Comment not found with such id");
}
