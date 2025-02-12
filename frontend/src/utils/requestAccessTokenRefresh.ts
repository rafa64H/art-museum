import { BACKEND_URL } from "../constants";
import {
  setUser,
  setUserLoading,
} from "../services/redux-toolkit/auth/authSlice";
import { store } from "../services/redux-toolkit/store";
import setUserStore from "./setUserStore";
export default async function requestAccessTokenRefresh() {
  const urlForRefresh = `${BACKEND_URL}/auth/refresh`;

  const response = await fetch(urlForRefresh, {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    store.dispatch(setUser(null));
    store.dispatch(setUserLoading(false));
    return response;
  }
  const responseData = await response.json();
  if (response.status === 200) {
    setUserStore(responseData);
    return response;
  }

  return response;
}
