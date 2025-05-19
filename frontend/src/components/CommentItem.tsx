import { useActionState, useRef, useState } from "react";
import { commentObjPost } from "../contexts/ContextCommentsPosts";
import UserPictureAndUsername from "./ui/UserPictureAndUsername";
import LikeBtn from "./ui/LikeBtn";
import DislikeBtn from "./ui/DislikeBtn";
import ReplyBtn from "./ui/ReplyBtn";
import InputTextArea from "./ui/InputTextArea";
import ButtonComponent from "./ui/ButtonComponent";
import {
  createReplyToComment,
  dislikeComment,
  likeComment,
} from "../utils/fetchFunctions";
import { isAxiosError } from "axios";
import AlertParagraph from "./ui/AlertParagraph";

type Props = {
  commentProp: commentObjPost;
  postId: string | undefined;
};

type likeOrDislikeCommentDataResponse = {
  commentLikes: string[];
  commentDislikes: string[];
  message: string;
};
function CommentItem({ commentProp, postId }: Props) {
  const [returnDataCreateReply, createReplyAction, isPendingCreateReply] =
    useActionState(async () => {
      try {
        const responsePostReply = await createReplyToComment(
          postId,
          commentProp._id,
          replyRef.current?.value,
        );

        return responsePostReply.data;
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response) {
            if (error.response.status === 404) {
              return {
                error: `${error.response.data.message}, maybe it was deleted recently or try reloading the page`,
              };
            }
            return { error: error.response.data.message };
          }
        }
      }
    }, null);
  const [commentLikesState, setCommentLikesState] = useState<string[]>(
    commentProp.likes,
  );
  const [commentDislikesState, setCommentDislikesState] = useState<string[]>(
    commentProp.dislikes,
  );
  const [showReplyBox, setShowReplyBox] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  const thereIsErrorInReturnDataCreateReply =
    returnDataCreateReply && "error" in returnDataCreateReply
      ? returnDataCreateReply.error
      : "";

  return (
    <li className="relative w-fit">
      <UserPictureAndUsername
        userId={commentProp.authorId}
      ></UserPictureAndUsername>
      <p className="mt-2 ml-[min(7rem,7%)]">{commentProp.content}</p>
      <div className="w-fit ml-[min(7rem,7%)]  flex gap-4 my-2">
        <LikeBtn
          arrayLiked={commentLikesState}
          onClickFunction={async () => {
            try {
              const responseLikeComment = await likeComment(
                postId,
                commentProp._id,
              );

              const responseLikeCommentData =
                responseLikeComment.data as likeOrDislikeCommentDataResponse;

              setCommentLikesState(responseLikeCommentData.commentLikes);
              setCommentDislikesState(responseLikeCommentData.commentDislikes);
            } catch (error) {
              console.log(error);
            }
          }}
          smallOrLarge="small"
        ></LikeBtn>

        <DislikeBtn
          arrayDisliked={commentDislikesState}
          onClickFunction={async () => {
            try {
              console.log(postId, commentProp._id);
              const responseDislikeComment = await dislikeComment(
                postId,
                commentProp._id,
              );
              const responseDislikeCommentData =
                responseDislikeComment.data as likeOrDislikeCommentDataResponse;
              setCommentDislikesState(
                responseDislikeCommentData.commentDislikes,
              );
              setCommentLikesState(responseDislikeCommentData.commentLikes);
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
        action={createReplyAction}
        className={`${showReplyBox ? "block" : "hidden"} ml-[min(7rem,7%)]`}
      >
        <AlertParagraph
          conditionError={thereIsErrorInReturnDataCreateReply ? true : false}
          textValue={thereIsErrorInReturnDataCreateReply}
        ></AlertParagraph>
        <div className="flex flex-col w-[min(45rem,25vw)]">
          <InputTextArea
            refProp={replyRef}
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

export default CommentItem;
