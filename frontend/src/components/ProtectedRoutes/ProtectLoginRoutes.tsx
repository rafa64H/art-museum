import { PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import requestAccessTokenRefresh from "../../utils/requestAccessTokenRefresh";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../services/redux-toolkit/store";

type ProtectedRouteProps = PropsWithChildren;
function ProtectedLoginRoute({ children }: ProtectedRouteProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user.userData && user.isLoading) {
          const response = await requestAccessTokenRefresh();

          if (response.ok) {
            navigate("/", { replace: true });
            return;
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkAuth();
  }, [dispatch, navigate, user.isLoading, user.userData]);

  return children;
}

export default ProtectedLoginRoute;
