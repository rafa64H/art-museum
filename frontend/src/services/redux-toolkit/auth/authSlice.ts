import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserReduxToolkit = {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "user" | "admin";
  verified: boolean;
  lastLogin: Date;
  accessToken: string;
};
export type AuthState = {
  user: UserReduxToolkit | null;
};

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserReduxToolkit>) {
      state.user = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.user = state.user
        ? { ...state.user, accessToken: action.payload }
        : null;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setUser, logout, setAccessToken } = authSlice.actions;

export default authSlice.reducer;
