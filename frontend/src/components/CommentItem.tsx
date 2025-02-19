import { useRef, useState } from "react";
import { commentObjPost } from "../contexts/ContextCommentsPosts";
import UserPictureAndUsername from "./ui/UserPictureAndUsername";
import LikeBtn from "./ui/LikeBtn";
import DislikeBtn from "./ui/DislikeBtn";
import ReplyBtn from "./ui/ReplyBtn";
import InputTextArea from "./ui/InputTextArea";
import ButtonComponent from "./ui/ButtonComponent";
import { createReplyToComment } from "../utils/fetchFunctions";
import { isAxiosError } from "axios";
import checkEmptyFieldsForm from "../utils/forms/checkEmptyFieldsForm";

type Props = {
  commentProp: commentObjPost;
  postId: string | undefined;
};
function CommentItem({ commentProp, postId }: Props) {
  const [alertMessage, setAlertMessage] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [submitReplyLoading, setSubmitReplyLoading] = useState(false);
  const replyRef = useRef<HTMLTextAreaElement>(null);

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
          setSubmitReplyLoading(true);
          try {
            const validate = checkEmptyFieldsForm(
              [replyRef.current!],
              setAlertMessage
            );
            if (!validate) {
              setSubmitReplyLoading(false);

              return;
            }

            const responsePostReply = await createReplyToComment({
              postId: postId,
              commentId: commentProp._id,
              replyContent: replyRef.current?.value,
            });

            console.log(await responsePostReply.data);
            setShowReplyBox(false);
            setSubmitReplyLoading(false);
            return;
          } catch (error) {
            if (isAxiosError(error)) {
              if (error.response) {
                if (error.response.status === 404) {
                  setAlertMessage(
                    `${error.response.data.message}, maybe it was deleted recently or try reloading the page`
                  );
                  setSubmitReplyLoading(false);
                  return;
                }
                setAlertMessage("Internal server error, try again later");
                setSubmitReplyLoading(false);
              }
            }
            setAlertMessage(
              "There was an error with the client try reloading the page"
            );
            setSubmitReplyLoading(false);
          }
        }}
        className={`${showReplyBox ? "block" : "hidden"} ml-[min(7rem,7%)]`}
      >
        <p className="text-lg font-bold text-red-600">{alertMessage}</p>
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
            loadingDisabled={submitReplyLoading}
            additionalClassnames="self-end p-1"
          ></ButtonComponent>
        </div>
      </form>
    </li>
  );
}

export default CommentItem;
