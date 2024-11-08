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
        if (response.status === 401) {
          return;
        }
        const responseData = await response.json();

        if (response.status === 200) {
          const userData: UserReduxToolkit = {
            id: responseData.user._doc._id as string,
            username: responseData.user._doc.username as string,
            name: responseData.user._doc.name as string,
            profilePictureURL: responseData.user._doc
              .profilePictureURL as string,
            email: responseData.user._doc.email as string,
            role: responseData.user._doc.role as "user" | "admin",
            lastLogin: responseData.user._doc.lastLogin as Date,
            verified: responseData.user._doc.verified as boolean,
            accessToken: responseData.accessToken as string,
          };

          dispatch(setUser(userData));
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
