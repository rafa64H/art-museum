import { useRef, useState } from "react";
import { commentObjPost } from "../contexts/ContextCommentsPosts";
import ButtonComponent from "./ui/ButtonComponent";
import UserPictureAndUsername from "./ui/UserPictureAndUsername";
import LikeBtn from "./ui/LikeBtn";
import DislikeBtn from "./ui/DislikeBtn";
import ReplyBtn from "./ui/ReplyBtn";
import InputTextArea from "./ui/InputTextArea";
import { getRepliesFromComment } from "../utils/fetchFunctions";

type Props = {
  commentObjProp: commentObjPost;
  postId: string | undefined;
};

type ReplyObjPost = {
  authorId: string;
  postId: string;
  content: string;
  commentId: string;
  createdAt: Date;
  updatedAt: Date;
};

function RepliesListPost({ commentObjProp, postId }: Props) {
  const [repliesState, setRepliesState] = useState<ReplyObjPost[]>([]);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [loadingGetReplies, setLoadingGetReplies] = useState(false);
  const [noMoreReplies, setNoMoreReplies] = useState(false);
  const replyButtonRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className={repliesState.length > 0 ? "border-l-2 pl-1" : ""}>
      <ul>
        {repliesState.map((reply) => {
          return (
            <li className="relative w-fit">
              <UserPictureAndUsername
                userId={reply.authorId}
              ></UserPictureAndUsername>
              <p className="ml-[min(7rem,7%)]">{reply.content}</p>
              <div className="w-fit ml-[min(7rem,7%)]  flex gap-4 my-2">
                <LikeBtn smallOrLarge="small"></LikeBtn>

                <DislikeBtn smallOrLarge="small"></DislikeBtn>

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
                    typeButton="button"
                    textBtn="Submit reply"
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

              if (responseGetReplies.ok) {
                const repliesData = await responseGetReplies.json();
                setRepliesState(repliesData.replies);
                setLoadingGetReplies(false);
                setNoMoreReplies(true);
                return;
              }
              throw new Error(
                `Could not fetch replies ${responseGetReplies.status}`
              );
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
