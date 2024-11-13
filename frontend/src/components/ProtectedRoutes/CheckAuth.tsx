import { PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import requestAccessTokenRefresh from "../../utils/requestAccessTokenRefresh";
import { setUser } from "../../services/redux-toolkit/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../services/redux-toolkit/store";
import setUserStoreCheckAuth from "../../utils/setUserStoreCheckAuth";

type ProtectedRouteProps = PropsWithChildren;
function CheckAuth({ children }: ProtectedRouteProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user.userData && user.isLoading) {
          const response = await requestAccessTokenRefresh();
          if (response.status === 401) {
            dispatch(setUser({ userData: null, isLoading: false }));
            return;
          }
          const responseData = await response.json();
          console.log(responseData);
          if (response.status === 200) {
            setUserStoreCheckAuth(responseData);
            return;
          }
        }
      } catch (error) {
        dispatch(setUser({ userData: null, isLoading: false }));
        console.error(error);
      }
    };

    checkAuth();
  }, [dispatch, navigate, user.isLoading, user.userData]);

  return children;
}

export default CheckAuth;
