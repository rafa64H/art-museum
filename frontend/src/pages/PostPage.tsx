import React from "react";
import { useParams } from "react-router-dom";

function PostPage() {
  const params = useParams();
  const postId = params.postId;
  return <div>PostPage {postId}</div>;
}

export default PostPage;
