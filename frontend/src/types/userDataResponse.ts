import { UserData } from "../services/redux-toolkit/auth/authSlice";

export interface UserDataResponse extends UserData {
  _id: string;
}
