import mongoose, { ObjectId } from "mongoose";

export interface PostDocument extends mongoose.Document {
  authorId: ObjectId;
  title: string;
  content: string;
  imageURL?: string | null;
  imageId?: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema<PostDocument>({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    default: null,
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    default: null,
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

export const PostModel = mongoose.model("Post", PostSchema);
