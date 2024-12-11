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
          <section>
            {post.imageURLs?.map((imageURL) => {
              return (
                <img
                  key={uuidv4()}
                  className="w-[min(25%,20rem)]"
                  src={imageURL ? imageURL : undefined}
                  alt={post.title}
                />
              );
            })}

            <h1>{post.title}</h1>
            <p>{post.content}</p>
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
