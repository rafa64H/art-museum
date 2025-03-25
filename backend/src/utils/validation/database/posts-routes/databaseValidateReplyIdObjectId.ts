import { ObjectId } from "mongodb";
import CustomError from "../../../../constants/customError";
import { ReplyDocument, ReplyModel } from "../../../../models/reply.model";

export default async function databaseValidateReplyIdObjectId(
  replyId: ObjectId,
  returnReply: boolean
): Promise<ReplyDocument | undefined> {
  const findReply = await ReplyModel.findOne(replyId);

  if (!findReply) throw new CustomError(404, "Reply not found");

  if (returnReply) {
    return findReply;
  }
}
