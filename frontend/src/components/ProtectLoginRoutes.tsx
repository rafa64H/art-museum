import { PropsWithChildren, useEffect } from "react";
import { useDispatch } from "react-redux";
import requestAccessTokenRefresh from "../utils/requestAccessTokenRefresh";
import {
  setUser,
  UserReduxToolkit,
} from "../services/redux-toolkit/auth/authSlice";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren;
function ProtectLoginRoutes({ children }: ProtectedRouteProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await requestAccessTokenRefresh();
        const responseData = await response.json();

        if (response.status === 200) {
          const userData: UserReduxToolkit = {
            id: responseData._id as string,
            username: responseData.username as string,
            name: responseData.name as string,
            email: responseData.email as string,
            role: responseData.role as "user" | "admin",
            lastLogin: responseData.lastLogin as Date,
            verified: responseData.verified as boolean,
            accessToken: responseData.accessToken as string,
          };

          dispatch(setUser(userData));
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkAuth();
  }, [dispatch, navigate]);

  return children;
}

export default ProtectLoginRoutes;
