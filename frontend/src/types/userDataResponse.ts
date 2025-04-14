import { UserData } from "../services/redux-toolkit/auth/authSlice";

export interface UserDataResponse extends UserData {
  _id: string;
}

export type ResponseUserDataType = {
  user: {
    _id: string;
    username: string;
    name: string;
    profilePictureURL: string;
    email: string;
    role: string;
    followers: string[];
    following: string[];
    lastLogin: Date;
    verified: boolean;
  };
  accessToken: string;
};
