import mongoose, { ObjectId } from "mongoose";

export interface ReplyDocument extends mongoose.Document {
  authorId: ObjectId;
  commentId: ObjectId;
  postId: ObjectId;
  content: string;
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
