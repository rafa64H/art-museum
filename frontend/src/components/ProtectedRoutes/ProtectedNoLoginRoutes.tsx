import { PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import requestAccessTokenRefresh from "../../utils/requestAccessTokenRefresh";
import { setUser } from "../../services/redux-toolkit/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../services/redux-toolkit/store";

type ProtectedRouteProps = PropsWithChildren;
function ProtectedNoLoginRoute({ children }: ProtectedRouteProps) {
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
            navigate("/sign-up", { replace: true });
            return;
          }
          const responseData = await response.json();

          if (response.status === 200) {
            const userData = {
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

            dispatch(setUser({ userData, isLoading: false }));
            return;
          }
          navigate("/sign-up", { replace: true });
        }
      } catch (error) {
        navigate("/sign-up", { replace: true });

        console.log(error);
      }
    };

    checkAuth();
  }, [dispatch, navigate, user.isLoading, user.userData]);

  return children;
}

export default ProtectedNoLoginRoute;
