import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type UserData = {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "user" | "admin";
  profilePictureURL: string;
  verified: boolean;
  changedEmail: boolean;
  previousEmailVerified: boolean;
  previousEmail: string | null;
  lastLogin: Date;
  accessToken: string;
  following: string[];
  followers: string[];
};
export type UserReduxToolkit =
  | {
      userData: UserData;
      isLoading: boolean;
    }
  | {
      userData: null;
      isLoading: boolean;
    };
export type AuthState = {
  user: UserReduxToolkit | { userData: null; isLoading: boolean };
};

const initialState: AuthState = {
  user: {
    userData: null,
    isLoading: true,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.user.userData = action.payload;
    },
    setUserLoading(state, action: PayloadAction<boolean>) {
      state.user.isLoading = action.payload;
    },
    setUserFollowing(state, action: PayloadAction<string[]>) {
      if (state.user.userData) {
        state.user.userData.following = action.payload;
      }
    },
    setUserFollowers(state, action: PayloadAction<string[]>) {
      if (state.user.userData) {
        state.user.userData.followers = action.payload;
      }
    },
    setAccessToken(state, action: PayloadAction<string>) {
      if (state.user.userData) {
        state.user.userData.accessToken = action.payload;
      }
    },
    setEmailVerified(state, action: PayloadAction<boolean>) {
      if (state.user.userData) {
        state.user.userData.verified = action.payload;
      }
    },
    setChangedEmail(state, action: PayloadAction<boolean>) {
      if (state.user.userData) {
        state.user.userData.changedEmail = action.payload;
      }
    },
    setPreviousEmail(state, action: PayloadAction<string>) {
      if (state.user.userData) {
        state.user.userData.previousEmail = action.payload;
      }
    },
    logout(state) {
      state.user.userData = null;
    },
  },
});

export const {
  setUser,
  setUserLoading,
  setUserFollowing,
  setUserFollowers,
  setEmailVerified,
  setChangedEmail,
  setPreviousEmail,
  logout,
  setAccessToken,
} = authSlice.actions;

export default authSlice.reducer;
