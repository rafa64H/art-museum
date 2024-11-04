import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface ImageDocument extends mongoose.Document {
  caption: string;
  filename: string;
  fileId: string;
  createdAt: Date;
}

const ImageSchema = new Schema<ImageDocument>({
  caption: {
    required: true,
    type: String,
  },
  filename: {
    required: true,
    type: String,
  },
  fileId: {
    required: true,
    type: String,
  },
  createdAt: {
    default: Date.now(),
    type: Date,
  },
});

export const ImageModel = mongoose.model("Image", ImageSchema);
