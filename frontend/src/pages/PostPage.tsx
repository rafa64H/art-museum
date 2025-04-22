import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import ButtonComponent from "../components/ui/ButtonComponent";
import LikeBtn from "../components/ui/LikeBtn";
import DislikeBtn from "../components/ui/DislikeBtn";
import InputTextArea from "../components/ui/InputTextArea";
import { useContextCommentsPosts } from "../contexts/ContextCommentsPosts";
import CommentItem from "../components/CommentItem";
import RepliesListPost from "../components/RepliesListPost";
import {
  createComment,
  dislikePost,
  getCommentsFromPost,
  getPostImages,
  getSinglePost,
  likePost,
} from "../utils/fetchFunctions";
import { isAxiosError } from "axios";
import AlertParagraph from "../components/ui/AlertParagraph";

type postDataResponse = {
  authorId: string;
  title: string;
  content: string;
  imageURLs?: string[] | null;
  imageIds?: string[] | null;
  tags: string[];
  likes: string[];
  dislikes: string[];
  createdAt: Date;
  updatedAt: Date;
};

type postImagesDataReponse = {
  imagesIds: string[];
  imagesURLs: string[];
};

type likeOrDislikePostDataResponse = {
  postLikes: string[];
  postDislikes: string[];
  message: string;
};
function PostPage() {
  const [returnDataGetPost, getPostAction, isPendingGetPost] = useActionState(
    async () => {
      try {
        const responseGetSinglePost = await getSinglePost(postId);

        const postData = (await responseGetSinglePost.data) as {
          post: postDataResponse;
        };

        return postData.post;
      } catch (error) {
        console.log(error);
        if (isAxiosError(error)) {
          if (error.response) return { error: error.response.data.message };
        }
        return { error: "Unexpected error getting the post, try again later" };
      }
    },
    null
  );
  const [returnDataGetPostImages, getPostImagesAction, isPendingGetPostImages] =
    useActionState(async () => {
      try {
        const responseGetPostImages = await getPostImages(postId);

        const responseGetPostImagesData = await responseGetPostImages.data;

        const imagesIds = responseGetPostImagesData.imagesIdsAndImagesURLs.map(
          (idURLObject: { imageId: string; imageURL: string }) =>
            idURLObject.imageId
        );

        const imagesURLs = responseGetPostImagesData.imagesIdsAndImagesURLs.map(
          (idURLObject: { imageId: string; imageURL: string }) =>
            idURLObject.imageURL
        );

        return {
          imagesIds: imagesIds,
          imagesURLs: imagesURLs,
        } as postImagesDataReponse;
      } catch (error) {
        console.log(error);
        if (isAxiosError(error)) {
          if (error.response) return { error: error.response.data.message };
        }
        return {
          error: "Unexpected error getting the images, try again later",
        };
      }
    }, null);

  const [returnDataGetComments, getCommentsAction, isPendingGetComments] =
    useActionState(async () => {
      try {
        const responseGetComments = await getCommentsFromPost(postId);

        const firstCommentsToSet = await responseGetComments.data;
        console.log(await firstCommentsToSet);
        setCommentsState(firstCommentsToSet.comments);
      } catch (error) {
        console.log(error);
        if (isAxiosError(error)) {
          if (error.response) return { error: error.response.data.message };
        }
        return {
          error: "Unexpected error getting the comments, try again later",
        };
      }
    }, null);

  const [returnDataCreateComment, createCommentAction, isPendingCreateComment] =
    useActionState(createComment, null);

  const successfulGetPost =
    returnDataGetPost && "_id" in returnDataGetPost
      ? (returnDataGetPost as postDataResponse)
      : false;
  const successfulGetImages =
    returnDataGetPostImages && "imagesIds" in returnDataGetPostImages
      ? returnDataGetPostImages
      : false;

  const thereIsErrorInCreateComment =
    returnDataCreateComment && "error" in returnDataCreateComment
      ? true
      : false;

  const [fullViewImage, setFullViewImage] = useState(false);
  const [selectedViewImage, setSelectedViewImage] = useState(0);
  const [postLikesState, setPostLikesState] = useState<string[]>([]);
  const [postDislikesState, setPostDislikesState] = useState<string[]>([]);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const params = useParams();
  const postId = params.postId;
  const user = useSelector((state: RootState) => state.auth.user);
  const { commentsState, setCommentsState } = useContextCommentsPosts();

  useEffect(() => {
    startTransition(getPostAction);
    startTransition(getPostImagesAction);
    startTransition(getCommentsAction);

    const post =
      returnDataGetPost && "_id" in returnDataGetPost
        ? (returnDataGetPost as postDataResponse)
        : null;
    if (post) {
      setPostLikesState(post.likes);
      setPostDislikesState(post.dislikes);
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (returnDataCreateComment && "data" in returnDataCreateComment)
      setCommentsState((prevValue) => [
        ...prevValue,
        returnDataCreateComment.data.newComment,
      ]);
  }, [returnDataCreateComment]);

  return (
    <>
      <Header></Header>
      {isPendingGetPost ? (
        <>
          <div>Loading</div>
        </>
      ) : successfulGetPost ? (
        <>
          <section className="bg-mainBg px-5 py-2 text-white">
            <h1 className="text-4xl font-semibold text-center">
              {successfulGetPost.title}
            </h1>

            <div className="flex flex-wrap gap-7 py-4">
              {successfulGetImages ? (
                successfulGetImages.imagesURLs.map(
                  (imageURL: string, index: number) => {
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
                  }
                )
              ) : (
                <></>
              )}
            </div>

            <div
              className={`${
                fullViewImage ? "block" : "hidden"
              } fixed top-1/2 left-1/2 z-40 translate-x-[-50%] translate-y-[-50%] text-white`}
            >
              <div>
                <ol className="absolute">
                  {successfulGetImages ? (
                    successfulGetImages.imagesURLs.map((imageURL, index) => {
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
                    })
                  ) : (
                    <></>
                  )}
                </ol>

                <img
                  src={
                    successfulGetImages
                      ? successfulGetImages.imagesURLs[selectedViewImage]
                      : ""
                  }
                ></img>
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
                  href={
                    successfulGetImages
                      ? successfulGetImages.imagesURLs[selectedViewImage]
                      : ""
                  }
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

            <p className="text-lg text-center">{successfulGetPost.content}</p>

            {successfulGetPost.tags.length > 0 ? (
              <>
                <p className="text-lg m-2">Tags: </p>

                {successfulGetPost.tags.map((tag) => (
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
              <LikeBtn
                smallOrLarge="large"
                arrayLiked={postLikesState}
                onClickFunction={async () => {
                  try {
                    const responseLike = await likePost(postId);
                    const responseLikeData =
                      responseLike.data as likeOrDislikePostDataResponse;

                    setPostLikesState(responseLikeData.postLikes);
                    setPostDislikesState(responseLikeData.postDislikes);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              ></LikeBtn>

              <DislikeBtn
                smallOrLarge="large"
                arrayDisliked={postDislikesState}
                onClickFunction={async () => {
                  try {
                    const responseDislike = await dislikePost(postId);
                    const responseDislikeData =
                      responseDislike.data as likeOrDislikePostDataResponse;
                    setPostLikesState(responseDislikeData.postLikes);
                    setPostDislikesState(responseDislikeData.postDislikes);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              ></DislikeBtn>
            </div>
          </section>

          <div className="py-2 border-b-firstLavender border-b-4 border-t-firstLavender border-t-4 w-full bg-firstBrown"></div>

          <section className="bg-mainBg px-10 text-white">
            <h2 className="text-2xl font-semibold text-center">Comments</h2>

            <form action={createCommentAction}>
              <AlertParagraph
                conditionError={thereIsErrorInCreateComment}
                textValue={
                  returnDataCreateComment && "error" in returnDataCreateComment
                    ? returnDataCreateComment.error
                    : ""
                }
              ></AlertParagraph>
              <div className="flex flex-col w-[min(45rem,70%)]">
                <input type="hidden" name="postId" value={postId}></input>
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
                  loadingDisabled={isPendingCreateComment}
                ></ButtonComponent>
              </div>
            </form>

            <ul>
              {isPendingGetComments ? (
                <>
                  <div>Loading...</div>
                </>
              ) : (
                commentsState.map((comment) => {
                  return (
                    <div key={uuidv4()}>
                      <CommentItem
                        commentProp={comment}
                        postId={postId}
                      ></CommentItem>

                      <div className="mb-10 pl-24">
                        <h3>Replies</h3>
                        <RepliesListPost
                          commentObjProp={comment}
                          postId={postId}
                        ></RepliesListPost>
                      </div>
                    </div>
                  );
                })
              )}
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
