import { useState } from "react";
import { commentObjPost } from "../contexts/ContextCommentsPosts";
import ButtonComponent from "./ui/ButtonComponent";
import { getRepliesFromComment } from "../utils/fetchFunctions";
import ReplyItem from "./ReplyItem";

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

function RepliesListPost({ commentObjProp, postId }: Props) {
  const [repliesState, setRepliesState] = useState<ReplyObjPost[]>([]);
  const [loadingGetReplies, setLoadingGetReplies] = useState(false);
  const [noMoreReplies, setNoMoreReplies] = useState(false);

  return (
    <div className={repliesState.length > 0 ? "border-l-2 pl-1" : ""}>
      <ul>
        {repliesState.map((reply) => {
          return (
            <ReplyItem
              reply={reply}
              postId={postId}
              commentObjProp={commentObjProp}
            ></ReplyItem>
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
