import { ObjectId } from "mongodb";
import CustomError from "../../../../constants/customError";
import {
  CommentDocument,
  CommentModel,
} from "../../../../models/comment.model";

export default async function databaseValidateCommentIdFromParam(
  commentId: ObjectId,
  returnComment: boolean
): Promise<CommentDocument | undefined> {
  const findComment = await CommentModel.findOne(commentId);

  if (!findComment) throw new CustomError(404, "Comment not found");

  if (returnComment) {
    return findComment;
  }
}
