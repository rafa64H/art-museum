import mongoose, { ObjectId } from "mongoose";
const Schema = mongoose.Schema;

export interface ImageDocument extends mongoose.Document {
  uploaderId: ObjectId;
  postId?: ObjectId;
  filename: string;
  imageURL: string;
  fileRefFirebaseStorage: string;
  createdAt: Date;
}

const ImageSchema = new Schema<ImageDocument>({
  filename: {
    required: true,
    type: String,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: null,
  },
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageURL: {
    required: true,
    type: String,
  },
  fileRefFirebaseStorage: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now(),
    type: Date,
  },
});

export const ImageModel = mongoose.model("Image", ImageSchema);
