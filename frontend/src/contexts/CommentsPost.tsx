import React, { createContext, useContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type commentObjPost = {
  authorId: string;
  postId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

type ContextCommentsPostsType = {
  commentsState: commentObjPost[];
  setCommentsState: React.Dispatch<React.SetStateAction<commentObjPost[]>>;
};

const ContextCommentsPosts = createContext<ContextCommentsPostsType | null>(
  null
);
export function ContextCommentsPostsProvider({ children }: Props) {
  const [commentsState, setCommentsState] = useState<commentObjPost[]>([]);
  return (
    <ContextCommentsPosts.Provider value={{ commentsState, setCommentsState }}>
      {children}
    </ContextCommentsPosts.Provider>
  );
}

export function useContextCommentsPosts() {
  const context = useContext(ContextCommentsPosts);
  if (!context) {
    throw new Error(
      "useContextCommentsPosts must be used within a ContextCommentsPostsProvider"
    );
  }
  return context;
}
