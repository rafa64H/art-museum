import mongoose, { ObjectId } from "mongoose";

export interface PostDocument extends mongoose.Document {
  authorId: ObjectId;
  title: string;
  content: string;
  imageURLs?: string[] | null;
  imageIds?: ObjectId[] | null;
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
  imageURLs: {
    type: [String],
    default: null,
  },
  imageIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Image",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const PostModel = mongoose.model("Post", PostSchema);
