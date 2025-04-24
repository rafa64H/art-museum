import { useActionState, useRef, useState } from "react";
import { commentObjPost } from "../contexts/ContextCommentsPosts";
import ButtonComponent from "./ui/ButtonComponent";
import UserPictureAndUsername from "./ui/UserPictureAndUsername";
import LikeBtn from "./ui/LikeBtn";
import DislikeBtn from "./ui/DislikeBtn";
import ReplyBtn from "./ui/ReplyBtn";
import InputTextArea from "./ui/InputTextArea";
import {
  createReplyToComment,
  dislikeReply,
  getRepliesFromComment,
  likeReply,
} from "../utils/fetchFunctions";
import { v4 as uuidv4 } from "uuid";
import { isAxiosError } from "axios";

type Props = {
  commentObjProp: commentObjPost;
  postId: string | undefined;
};

type ReplyObjPost = {
  _id: string;
  authorId: string;
  postId: string;
  content: string;
  commentId: string;
  createdAt: Date;
  updatedAt: Date;
};

type likeOrDislikeReplyDataResponse = {
  replyLikes: string[];
  replyDislikes: string[];
  message: string;
};

function RepliesListPost({ commentObjProp, postId }: Props) {
  const [repliesState, setRepliesState] = useState<ReplyObjPost[]>([]);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [loadingGetReplies, setLoadingGetReplies] = useState(false);
  const [noMoreReplies, setNoMoreReplies] = useState(false);
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

  return (
    <div className={repliesState.length > 0 ? "border-l-2 pl-1" : ""}>
      <ul>
        {repliesState.map((reply) => {
          return (
            <li key={uuidv4()} className="relative w-fit">
              <UserPictureAndUsername
                userId={reply.authorId}
              ></UserPictureAndUsername>
              <p className="ml-[min(7rem,7%)]">{reply.content}</p>
              <div className="w-fit ml-[min(7rem,7%)]  flex gap-4 my-2">
                <LikeBtn
                  arrayLiked={[]}
                  onClickFunction={async () => {
                    try {
                      const responseLikeReply = await likeReply(
                        postId,
                        commentObjProp._id,
                        reply._id
                      );
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  smallOrLarge="small"
                ></LikeBtn>

                <DislikeBtn
                  arrayDisliked={[]}
                  onClickFunction={async () => {
                    try {
                      const responseDislikeReply = await dislikeReply(
                        postId,
                        commentObjProp._id,
                        reply._id
                      );
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
                className={`${
                  showReplyBox ? "block" : "hidden"
                } ml-[min(7rem,7%)]`}
                action={createReplyAction}
              >
                <div className="flex flex-col w-[min(45rem,25vw)]">
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
        })}
      </ul>
      {noMoreReplies ? (
        <></>
      ) : (
        <ButtonComponent
          textBtn={
            repliesState.length > 0 ? "Show more replies" : "Show replies"
          }
          typeButton="button"
          loadingDisabled={loadingGetReplies}
          onClickFunction={async () => {
            setLoadingGetReplies(true);
            try {
              const responseGetReplies = await getRepliesFromComment({
                postId: postId,
                commentId: commentObjProp._id,
              });

              const repliesData = await responseGetReplies.data;
              setRepliesState(repliesData.replies);
              setLoadingGetReplies(false);
              setNoMoreReplies(true);
              return;
            } catch (error) {
              console.log(error);
              setLoadingGetReplies(false);
            }
          }}
        ></ButtonComponent>
      )}
    </div>
  );
}

export default RepliesListPost;
