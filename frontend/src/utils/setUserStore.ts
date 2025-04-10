import {
  setUser,
  setUserLoading,
} from "../services/redux-toolkit/auth/authSlice";
import { store } from "../services/redux-toolkit/store";

export type ResponseDataType = {
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
    changedEmail: boolean;
    previousEmail: string | null;
    previousEmailVerified: boolean;
  };
  accessToken: string;
};

//You should send as argument an await response.data
export default function setUserStore(responseData: ResponseDataType): void {
  const userData = {
    id: responseData.user._id as string,
    username: responseData.user.username as string,
    name: responseData.user.name as string,
    profilePictureURL: responseData.user.profilePictureURL as string,
    email: responseData.user.email as string,
    following: responseData.user.following as string[],
    followers: responseData.user.followers as string[],
    role: responseData.user.role as "user" | "admin",
    lastLogin: responseData.user.lastLogin as Date,
    verified: responseData.user.verified as boolean,

    changedEmail: responseData.user.changedEmail as boolean,
    previousEmail: responseData.user.previousEmail as string | null,
    previousEmailVerified: responseData.user.previousEmailVerified as boolean,
    accessToken: responseData.accessToken as string,
  };

  store.dispatch(setUser(userData));
  store.dispatch(setUserLoading(false));
}
