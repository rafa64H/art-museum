import React from "react";

function CommentItem() {
  return (
    <li className="relative w-fit">
      <UserPictureAndUsername
        userId={comment.authorId}
      ></UserPictureAndUsername>
      <p className="ml-[min(7rem,7%)]">{comment.content}</p>
      <div className="w-fit ml-[min(7rem,7%)]  flex gap-4 my-2">
        <LikeBtn smallOrLarge="small"></LikeBtn>

        <DislikeBtn smallOrLarge="small"></DislikeBtn>

        <ReplyBtn></ReplyBtn>
      </div>

      <form className="ml-[min(7rem,7%)]">
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
