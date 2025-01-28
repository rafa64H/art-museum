import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../constants";
import Header from "../components/Header";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import ButtonComponent from "../components/ui/ButtonComponent";
import LikeBtn from "../components/ui/LikeBtn";
import DislikeBtn from "../components/ui/DislikeBtn";
import InputTextArea from "../components/ui/InputTextArea";
import ReplyBtn from "../components/ui/ReplyBtn";
import UserPictureAndUsername from "../components/ui/UserPictureAndUsername";
import checkEmptyFieldsForm from "../utils/forms/checkEmptyFieldsForm";

type postDataResponse = {
  authorId: string;
  title: string;
  content: string;
  imageURLs?: string[] | null;
  imageIds?: string[] | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};
function PostPage() {
  const [post, setPost] = useState<postDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullViewImage, setFullViewImage] = useState(false);
  const [selectedViewImage, setSelectedViewImage] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [commentSubmitLoading, setCommentSubmitLoading] = useState(false);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const params = useParams();
  const postId = params.postId;
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const getPost = async () => {
      try {
        const urlGetSinglePost = `${BACKEND_URL}/api/posts/${postId}`;

        const responseGetSinglePost = await fetch(urlGetSinglePost, {
          method: "GET",
        });

        if (!responseGetSinglePost.ok) {
          return;
        }

        const postData = await responseGetSinglePost.json();

        setPost(postData.post);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, [postId]);
  return (
    <>
      <Header></Header>
      {loading ? (
        <>
          <div>Loading</div>
        </>
      ) : post ? (
        <>
          <section className="bg-mainBg px-5 py-2 text-white">
            <h1 className="text-4xl font-semibold text-center">{post.title}</h1>

            <div className="flex flex-wrap gap-7 py-4">
              {post.imageURLs?.map((imageURL, index) => {
                return (
                  <div
                    key={uuidv4()}
                    className="relative w-[min(40%,20rem)] h-fit"
                  >
                    <img src={imageURL ? imageURL : undefined} />
                    <button
                      onClick={() => {
                        setSelectedViewImage(index);
                        setFullViewImage(true);
                      }}
                      className="absolute z-20 top-0 flex justify-center items-center w-full h-full transition-all duration-150 opacity-0 hover:opacity-100 hover:bg-black hover:bg-opacity-70 cursor-pointer"
                    >
                      Open full view of the image
                    </button>
                  </div>
                );
              })}
            </div>

            <div
              className={`${
                fullViewImage ? "block" : "hidden"
              } fixed top-1/2 left-1/2 z-40 translate-x-[-50%] translate-y-[-50%] text-white`}
            >
              <div>
                <ol className="absolute">
                  {post.imageURLs?.map((imageURL, index) => {
                    return (
                      <li className="my-2" key={uuidv4()}>
                        <button
                          onClick={() => {
                            setSelectedViewImage(index);
                          }}
                          className={`translate-x-[-100%] ${
                            selectedViewImage === index
                              ? "bg-firstBrown border-firstGreen"
                              : ""
                          } border-2 border-solid hover:border-firstGreen p-4 rounded-full`}
                        ></button>
                      </li>
                    );
                  })}
                </ol>

                <img src={post.imageURLs![selectedViewImage]}></img>
                <button
                  onClick={() => {
                    setFullViewImage(false);
                  }}
                >
                  <i className="absolute top-0 right-0 translate-x-[100%] fa-solid fa-xmark text-3xl px-4 py-2 hover:text-firstGreen"></i>
                </button>
                <a
                  target="_blank"
                  className="hover:underline"
                  href={post.imageURLs![selectedViewImage]}
                >
                  See image in a new window
                </a>
              </div>
            </div>

            <div
              className={`${
                fullViewImage ? "block" : "hidden"
              } fixed top-0 left-0 z-30 w-full h-full bg-black bg-opacity-70`}
            ></div>

            <p className="text-lg text-center">{post.content}</p>

            {post.tags.length > 0 ? (
              <>
                <p className="text-lg m-2">Tags: </p>

                {post.tags.map((tag) => (
                  <li
                    key={uuidv4()}
                    className="inline-block p-2 cursor-default text-lg mx-2 font-semibold bg-firstGreen rounded-full"
                  >
                    {tag}
                  </li>
                ))}
              </>
            ) : null}

            <div className="flex gap-4 my-4">
              <LikeBtn smallOrLarge="large"></LikeBtn>

              <DislikeBtn smallOrLarge="large"></DislikeBtn>
            </div>
          </section>

          <div className="py-2 border-b-firstLavender border-b-4 border-t-firstLavender border-t-4 w-full bg-firstBrown"></div>

          <section className="bg-mainBg text-white">
            <h2 className="text-2xl font-semibold text-center">Comments</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCommentSubmitLoading(true);
                try {
                  checkEmptyFieldsForm([commentRef.current!], setAlertMessage);

                  const urlToCreatePost = `${BACKEND_URL}/api/posts/${postId}/comments`;
                  const responseCreateComment = await fetch(urlToCreatePost, {
                    headers: {
                      authorization: "Bearer " + user.userData?.accessToken,
                      "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                      content: commentRef.current?.value,
                    }),
                  });

                  console.log(await responseCreateComment.json());
                  setCommentSubmitLoading(false);
                } catch (error) {
                  console.log(error);
                  setCommentSubmitLoading(false);
                }
              }}
            >
              <div className="flex flex-col w-[min(45rem,70%)]">
                <InputTextArea
                  refProp={commentRef}
                  smallOrLarge="small"
                  width="100%"
                  minHeight="4rem"
                  idAndFor="commentText"
                  placeholder="Write your comment's text"
                  textLabel="Comment"
                ></InputTextArea>
                <ButtonComponent
                  typeButton="submit"
                  textBtn="Submit comment"
                  additionalClassnames="self-end"
                  loadingDisabled={commentSubmitLoading}
                ></ButtonComponent>
              </div>
            </form>

            <ul>
              <li className="relative w-fit">
                <UserPictureAndUsername
                  userId={user.userData?.id}
                ></UserPictureAndUsername>
                <p className="ml-[min(7rem,7%)]">
                  Lore ipsum amet data adida lekelev achima derek anem malinda
                  nemadi nomadi jalenimina
                </p>
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
            </ul>
          </section>
        </>
      ) : (
        <>
          <div>Post not found</div>
        </>
      )}
    </>
  );
}

export default PostPage;
