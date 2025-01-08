import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../constants";
import Header from "../components/Header";
import { v4 as uuidv4 } from "uuid";

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

            <p>
              Tags:{" "}
              {post.tags.length > 0
                ? post.tags.join(", ")
                : "there are no tags!"}
            </p>
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
