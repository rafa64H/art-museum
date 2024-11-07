import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  username: string;
  password: string;
  verified: boolean;
  profilePictureURL: string;
  role: "user" | "admin";
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
    resetPasswordToken: String || undefined,
    resetPasswordExpiresAt: Date || undefined,
    verificationToken: String || undefined,
    verificationTokenExpiresAt: Date || undefined,
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", UserSchema);
