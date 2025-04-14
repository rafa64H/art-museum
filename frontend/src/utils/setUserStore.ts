import {
  setUser,
  setUserLoading,
} from "../services/redux-toolkit/auth/authSlice";
import { store } from "../services/redux-toolkit/store";
import { ResponseUserDataType } from "../types/userDataResponse";

//You should send as argument an await response.data
export default function setUserStore(responseData: ResponseUserDataType): void {
  const userData = {
    _id: responseData.user._id as string,
    username: responseData.user.username as string,
    name: responseData.user.name as string,
    profilePictureURL: responseData.user.profilePictureURL as string,
    email: responseData.user.email as string,
    following: responseData.user.following as string[],
    followers: responseData.user.followers as string[],
    role: responseData.user.role as "user" | "admin",
    lastLogin: responseData.user.lastLogin as Date,
    verified: responseData.user.verified as boolean,

    accessToken: responseData.accessToken as string,
  };

  store.dispatch(setUser(userData));
  store.dispatch(setUserLoading(false));
}
