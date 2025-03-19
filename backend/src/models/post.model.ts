import mongoose, { ObjectId } from "mongoose";

export interface PostDocument extends mongoose.Document {
  authorId: ObjectId;
  title: string;
  content: string;

  //This will be used with React to do a .map() to render an animation
  //While requesting the post images from the images routes, os it has to be a number[]
  amountOfImages?: number[];
  tags: string[];
  likes: string[];
  dislikes: string[];
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
    default: "",
  },
  amountOfImages: {
    type: [Number],
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
  likes: {
    type: [String],
    default: [],
  },
  dislikes: {
    type: [String],
    default: [],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const PostModel = mongoose.model("Post", PostSchema);
