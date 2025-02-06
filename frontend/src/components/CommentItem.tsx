import React, { useRef, useState } from "react";
import { commentObjPost } from "../contexts/ContextCommentsPosts";
import UserPictureAndUsername from "./ui/UserPictureAndUsername";
import LikeBtn from "./ui/LikeBtn";
import DislikeBtn from "./ui/DislikeBtn";
import ReplyBtn from "./ui/ReplyBtn";
import InputTextArea from "./ui/InputTextArea";
import ButtonComponent from "./ui/ButtonComponent";
import { BACKEND_URL } from "../constants";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";

type Props = {
  commentProp: commentObjPost;
  postId: string | undefined;
};
function CommentItem({ commentProp, postId }: Props) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <li className="relative w-fit">
      <UserPictureAndUsername
        userId={commentProp.authorId}
      ></UserPictureAndUsername>
      <p className="mt-2 ml-[min(7rem,7%)]">{commentProp.content}</p>
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
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const replyValue = replyRef.current?.value;

            const urlToPostReply = `${BACKEND_URL}/api/posts/${postId}/comments/${commentProp._id}/replies`;
            const responsePostReply = await fetch(urlToPostReply, {
              method: "POST",
              headers: {
                authorization: "Bearer " + user.userData?.accessToken,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                postId: postId,
                commentId: commentProp._id,
                content: replyValue,
              }),
            });

            if (responsePostReply.ok) {
              console.log(await responsePostReply.json());
              setShowReplyBox(false);
              return;
            }

            throw new Error("Failed to post reply");
          } catch (error) {
            console.log(error);
          }
        }}
        className={`${showReplyBox ? "block" : "hidden"} ml-[min(7rem,7%)]`}
      >
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
            additionalClassnames="self-end p-1"
          ></ButtonComponent>
        </div>
      </form>
    </li>
  );
}

export default CommentItem;
