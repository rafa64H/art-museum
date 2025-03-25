import { ObjectId } from "mongodb";
import CustomError from "../../../../constants/customError";
import { PostDocument, PostModel } from "../../../../models/post.model";

export default async function databaseValidatePostIdObjectId(
  postId: ObjectId,
  returnPost: boolean
): Promise<PostDocument | undefined> {
  const findPost = await PostModel.findOne(postId);

  if (!findPost) throw new CustomError(404, "Post not found");

  if (returnPost) {
    return findPost;
  }
}
