import { v4 as uuidv4 } from "uuid";
import LikeBtn from "./ui/LikeBtn";
import UserPictureAndUsername from "./ui/UserPictureAndUsername";
import DislikeBtn from "./ui/DislikeBtn";
import ReplyBtn from "./ui/ReplyBtn";
import { useActionState, useRef, useState } from "react";
import { commentObjPost } from "../contexts/ContextCommentsPosts";
import {
  createReplyToComment,
  dislikeReply,
  likeReply,
} from "../utils/fetchFunctions";
import { isAxiosError } from "axios";
import AlertParagraph from "./ui/AlertParagraph";
import InputTextArea from "./ui/InputTextArea";
import ButtonComponent from "./ui/ButtonComponent";
type ReplyObjPost = {
  _id: string;
  authorId: string;
  postId: string;
  content: string;
  commentId: string;
  createdAt: Date;
  updatedAt: Date;
};
type Props = {
  reply: ReplyObjPost;
  postId: string | undefined;
  commentObjProp: commentObjPost;
};

type likeOrDislikeReplyDataResponse = {
  replyLikes: string[];
  replyDislikes: string[];
  message: string;
};

function ReplyItem({ reply, postId, commentObjProp }: Props) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const replyButtonRef = useRef<HTMLTextAreaElement>(null);

  const [replyLikesState, setReplyLikesState] = useState<string[]>([]);
  const [replyDislikesState, setReplyDislikesState] = useState<string[]>([]);

  const [returnDataCreateReply, createReplyAction, isPendingCreateReply] =
    useActionState(async (prevState: unknown, formData: FormData) => {
      try {
        const postIdParam = postId;
        const commentId = commentObjProp._id;
        const replyContent = formData.get("replyText");

        await createReplyToComment(
          postIdParam,
          commentId,
          replyContent!.toString()
        );
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response) {
            return { error: error.response.data.message };
          }
        }
        return { error: "An error ocurred, try again later" };
      }
    }, null);

  const thereIsErrorInReturnDataCreateReply =
    returnDataCreateReply && "error" in returnDataCreateReply
      ? returnDataCreateReply.error
      : "";
  return (
    <li key={uuidv4()} className="relative w-fit">
      <UserPictureAndUsername userId={reply.authorId}></UserPictureAndUsername>
      <p className="ml-[min(7rem,7%)]">{reply.content}</p>
      <div className="w-fit ml-[min(7rem,7%)]  flex gap-4 my-2">
        <LikeBtn
          arrayLiked={replyLikesState}
          onClickFunction={async () => {
            try {
              const responseLikeReply = await likeReply(
                postId,
                commentObjProp._id,
                reply._id
              );

              const responseLikeReplyData =
                responseLikeReply.data as likeOrDislikeReplyDataResponse;

              setReplyLikesState(responseLikeReplyData.replyLikes);
              setReplyDislikesState(responseLikeReplyData.replyDislikes);
            } catch (error) {
              console.log(error);
            }
          }}
          smallOrLarge="small"
        ></LikeBtn>

        <DislikeBtn
          arrayDisliked={replyDislikesState}
          onClickFunction={async () => {
            try {
              const responseDislikeReply = await dislikeReply(
                postId,
                commentObjProp._id,
                reply._id
              );

              const responseDislikeReplyData =
                responseDislikeReply.data as likeOrDislikeReplyDataResponse;

              setReplyLikesState(responseDislikeReplyData.replyLikes);
              setReplyDislikesState(responseDislikeReplyData.replyDislikes);
            } catch (error) {
              console.log(error);
            }
          }}
          smallOrLarge="small"
        ></DislikeBtn>

        <ReplyBtn
          onClickFunction={() => {
            setShowReplyBox((prevValue) => !prevValue);
          }}
        ></ReplyBtn>
      </div>

      <form
        className={`${showReplyBox ? "block" : "hidden"} ml-[min(7rem,7%)]`}
        action={createReplyAction}
      >
        <div className="flex flex-col w-[min(45rem,25vw)]">
          <AlertParagraph
            conditionError={thereIsErrorInReturnDataCreateReply ? true : false}
            textValue={thereIsErrorInReturnDataCreateReply}
          ></AlertParagraph>
          <InputTextArea
            refProp={replyButtonRef}
            smallOrLarge="small"
            width="100%"
            minHeight="4rem"
            idAndFor="replyText"
            placeholder="Write your reply"
            textLabel="Reply"
          ></InputTextArea>
          <ButtonComponent
            typeButton="submit"
            textBtn="Submit reply"
            loadingDisabled={isPendingCreateReply}
            additionalClassnames="self-end p-1"
          ></ButtonComponent>
        </div>
      </form>
    </li>
  );
}

export default ReplyItem;
