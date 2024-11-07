import mongoose, { ObjectId } from "mongoose";
const Schema = mongoose.Schema;

interface profilePictureDocument extends mongoose.Document {
  uploaderId: ObjectId;
  filename: string;
  imageURL: string;
  fileRefFirebaseStorage: string;
  createdAt: Date;
}

const ProfilePictureSchema = new Schema<profilePictureDocument>({
  filename: {
    required: true,
    type: String,
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

export const ProfilePictureModel = mongoose.model(
  "ProfilePicture",
  ProfilePictureSchema
);
