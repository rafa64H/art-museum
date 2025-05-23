import mongoose, { ObjectId } from "mongoose";

export interface CommentDocument extends mongoose.Document {
  authorId: ObjectId;
  postId: ObjectId;
  content: string;
  likes: string[];
  dislikes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new mongoose.Schema<CommentDocument>({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: [String],
    default: [],
  },
  dislikes: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const CommentModel = mongoose.model("Comment", CommentSchema);
