import { PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import requestAccessTokenRefresh from "../../utils/requestAccessTokenRefresh";
import {
  setUser,
  setUserLoading,
} from "../../services/redux-toolkit/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../services/redux-toolkit/store";

type ProtectedRouteProps = PropsWithChildren;
function CheckAuth({ children }: ProtectedRouteProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user.userData && user.isLoading) {
          await requestAccessTokenRefresh();
        }
      } catch (error) {
        dispatch(setUser(null));
        dispatch(setUserLoading(false));
        console.error(error);
      }
    };

    checkAuth();
  }, [dispatch, navigate, user.isLoading, user.userData]);

  return children;
}

export default CheckAuth;
