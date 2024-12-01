import { BACKEND_URL } from "../constants";
import { setUser } from "../services/redux-toolkit/auth/authSlice";
import { store } from "../services/redux-toolkit/store";
import setUserStoreLogin from "./setUserStore";
export default async function requestAccessTokenRefresh() {
  const url = `${BACKEND_URL}/auth/refresh`;

  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    store.dispatch(setUser({ userData: null, isLoading: false }));
    return response;
  }
  const responseData = await response.json();
  if (response.status === 200) {
    setUserStoreLogin(responseData);
    return response;
  }

  return response;
}
