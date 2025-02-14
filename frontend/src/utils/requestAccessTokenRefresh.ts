import {
  setUser,
  setUserLoading,
} from "../services/redux-toolkit/auth/authSlice";
import { store } from "../services/redux-toolkit/store";
import { fetchRefreshAuth } from "./fetchFunctions";
import setUserStore from "./setUserStore";
export default async function requestAccessTokenRefresh() {
  const responseRefresh = await fetchRefreshAuth();
  if (responseRefresh.status === 401) {
    store.dispatch(setUser(null));
    store.dispatch(setUserLoading(false));
    return responseRefresh;
  }
  const responseRefreshData = await responseRefresh.data;
  if (responseRefresh.status === 200) {
    setUserStore(responseRefreshData);
    return responseRefresh;
  }

  return responseRefresh;
}
