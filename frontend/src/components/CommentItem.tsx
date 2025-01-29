import React, { useRef, useState } from "react";
import { commentObjPost } from "../contexts/ContextCommentsPosts";
import UserPictureAndUsername from "./ui/UserPictureAndUsername";
import LikeBtn from "./ui/LikeBtn";
import DislikeBtn from "./ui/DislikeBtn";
import ReplyBtn from "./ui/ReplyBtn";
import InputTextArea from "./ui/InputTextArea";
import ButtonComponent from "./ui/ButtonComponent";

type Props = {
  commentProp: commentObjPost;
};
function CommentItem({ commentProp }: Props) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  return (
    <li className="relative w-fit">
      <UserPictureAndUsername
        userId={commentProp.authorId}
      ></UserPictureAndUsername>
      <p className="ml-[min(7rem,7%)]">{commentProp.content}</p>
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
        className={`${showReplyBox ? "block" : "hidden"} ml-[min(7rem,7%)]`}
      >
        <div className="flex flex-col w-[min(45rem,70%)]">
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
            typeButton="button"
            textBtn="Submit reply"
            additionalClassnames="self-end p-1"
          ></ButtonComponent>
        </div>
      </form>
    </li>
  );
}

export default CommentItem;
