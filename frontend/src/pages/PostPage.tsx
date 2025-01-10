import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../constants";
import Header from "../components/Header";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import ButtonComponent from "../components/ui/ButtonComponent";

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
              <button className="p-2 bg-FirstDarkBlue text-firstGreen transition-all duration-150 hover:bg-firstGreen hover:text-white font-semibold">
                Like
                <i className=" mx-2 fa-solid fa-thumbs-up"></i>1
              </button>

              <button className="p-2 bg-firstBrown transition-all duration-150 hover:bg-firstGreen font-semibold">
                Dislike
                <i className=" mx-2 fa-solid fa-thumbs-down"></i>0
              </button>
            </div>
          </section>

          <div className="py-2 border-b-firstLavender border-b-4 border-t-firstLavender border-t-4 w-full bg-firstBrown"></div>

          <section className="bg-mainBg text-white">
            <h2 className="text-2xl font-semibold text-center">Comments</h2>

            <form>
              <div className="flex flex-col justify-start items-start w-[min(45rem,70%)]">
                <label className="text-lg block" htmlFor="text">
                  Write your comment:
                </label>
                <textarea
                  className="block border-2 mt-2 w-full min-h-[4rem] lg:mt-0 lg:col-span-2 border-black resize-none p-2 text-black data-[error-input=true]:border-red-700"
                  id="text"
                  placeholder="Write text for your comment"
                ></textarea>
                <ButtonComponent
                  typeButton="button"
                  textBtn="Submit comment"
                  additionalClassnames="self-end"
                ></ButtonComponent>
              </div>
            </form>

            <ul>
              <li className="relative w-fit">
                <div className="flex items-center">
                  <img
                    className="w-[min(7rem,7%)] h-[min(7rem,7%)] rounded-full"
                    src={user.userData?.profilePictureURL}
                  ></img>
                  <p className="ml-2">{user.userData?.username}</p>
                </div>
                <p className="ml-[min(7rem,7%)]">
                  Lore ipsum amet data adida lekelev achima derek anem malinda
                  nemadi nomadi jalenimina
                </p>
                <div className="w-fit ml-[min(7rem,7%)]  flex gap-4 my-2">
                  <button className="p-1 bg-firstBrown transition-all duration-150 hover:bg-firstGreen font-semibold">
                    Like
                    <i className=" mx-2 fa-solid fa-thumbs-up"></i>0
                  </button>

                  <button className="p-1 bg-firstBrown transition-all duration-150 hover:bg-firstGreen font-semibold">
                    Dislike
                    <i className=" mx-2 fa-solid fa-thumbs-down"></i>0
                  </button>

                  <button className="transition-all duration-150 hover:text-firstGreen font-semibold">
                    Reply
                    <i className="mx-2 fa-solid fa-reply"></i>
                  </button>
                </div>

                <form className="ml-[min(7rem,7%)]">
                  <div className="flex flex-col justify-start items-start w-[min(45rem,70%)]">
                    <label className="text-lg block" htmlFor="text">
                      Write your reply:
                    </label>
                    <textarea
                      className="block border-1 mt-2 w-full min-h-[4rem] lg:mt-0 lg:col-span-2 border-black resize-none p-2 text-black data-[error-input=true]:border-red-700"
                      id="text"
                      placeholder="Write text for your reply"
                    ></textarea>
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
