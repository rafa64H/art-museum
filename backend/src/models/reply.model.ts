import mongoose, { ObjectId } from "mongoose";

export interface ReplyDocument extends mongoose.Document {
  authorId: ObjectId;
  commentId: ObjectId;
  postId: ObjectId;
  content: string;
  likes: string[];
  dislikes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ReplySchema = new mongoose.Schema<ReplyDocument>({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
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

export const ReplyModel = mongoose.model("Reply", ReplySchema);
