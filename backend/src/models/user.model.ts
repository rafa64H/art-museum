import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  username: string;
  password: string;
  verified: boolean;
  profilePictureURL: string;
  profilePictureId: ObjectId | null;
  role: "user" | "admin";
  followers: string[];
  following: string[];
  changedEmail: boolean;
  previousEmailVerified: boolean;
  previousEmail: string | null;
  lastLogin: Date;
  createdAt: Date;
  lastUpdated: Date;
  resetPasswordToken: String | undefined;
  resetPasswordExpiresAt: Date | undefined;
  verificationToken: String | undefined;
  verificationTokenExpiresAt: Date | undefined;
}

const UserSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePictureURL: {
      default:
        "https://firebasestorage.googleapis.com/v0/b/crisp-ecommerce-developm-4e4a7.appspot.com/o/usersProfilePictures%2FnoProfilePicture%2Fno-image.webp?alt=media&token=be573938-4699-4dc9-8946-de509efb42a2",
      type: String,
      required: true,
    },
    profilePictureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProfilePicture",
      default: null,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    followers: {
      type: [String],
      required: true,
      default: [],
    },
    following: {
      type: [String],
      required: true,
      default: [],
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    changedEmail: {
      type: Boolean,
      default: false,
    },
    previousEmailVerified: {
      type: Boolean,
      default: false,
    },
    previousEmail: {
      type: String,
      default: null,
    },
    resetPasswordToken: String || undefined,
    resetPasswordExpiresAt: Date || undefined,
    verificationToken: String || undefined,
    verificationTokenExpiresAt: Date || undefined,
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", UserSchema);
