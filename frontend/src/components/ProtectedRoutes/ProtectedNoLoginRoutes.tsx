import { PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import requestAccessTokenRefresh from "../../utils/requestAccessTokenRefresh";
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
            navigate("/sign-up", { replace: true });
            return;
          }

          if (response.ok) {
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
