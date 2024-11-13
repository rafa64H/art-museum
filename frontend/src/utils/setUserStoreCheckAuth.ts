import { setUser } from "../services/redux-toolkit/auth/authSlice";
import { store } from "../services/redux-toolkit/store";

type ResponseDataType = {
  user: {
    _doc: {
      _id: string;
      username: string;
      name: string;
      profilePictureURL: string;
      email: string;
      role: string;
      lastLogin: Date;
      verified: boolean;
    };
  };
  accessToken: string;
};

export default function setUserStoreCheckAuth(
  responseData: ResponseDataType
): void {
  const userData = {
    id: responseData.user._doc._id as string,
    username: responseData.user._doc.username as string,
    name: responseData.user._doc.name as string,
    profilePictureURL: responseData.user._doc.profilePictureURL as string,
    email: responseData.user._doc.email as string,
    role: responseData.user._doc.role as "user" | "admin",
    lastLogin: responseData.user._doc.lastLogin as Date,
    verified: responseData.user._doc.verified as boolean,
    accessToken: responseData.accessToken as string,
  };

  store.dispatch(setUser({ userData, isLoading: false }));
}
