import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../services/redux-toolkit/store";
import ProfilePage from "../../pages/ProfilePage";
import { getUser } from "../../utils/fetchFunctions";

function CheckProfilePage() {
  const [getUserProfileLoading, setGetUserProfileLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const params = useParams();

  const userIdParam = params.userId;

  useEffect(() => {
    async function getUserFunction() {
      try {
        const responseGetUser = await getUser({ userIdParam });

        if (responseGetUser.ok) {
          const responseGetUserData = await responseGetUser.json();
          const userData = {
            ...responseGetUserData.user,
            id: responseGetUserData.user._id,
            _id: undefined,
          };

          setUserProfile(userData);
          setGetUserProfileLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (userIdParam === user.userData?.id) {
      setGetUserProfileLoading(false);
    } else {
      getUserFunction();
    }
  }, [
    dispatch,
    navigate,
    user.userData?.accessToken,
    user.userData?.id,
    userIdParam,
  ]);

  if (userIdParam === user.userData?.id) {
    return <ProfilePage isUserProfile={true}></ProfilePage>;
  }
  if (getUserProfileLoading) {
    return (
      <ProfilePage
        isUserProfile={false}
        getUserProfileLoading={true}
      ></ProfilePage>
    );
  }
  return (
    <ProfilePage isUserProfile={false} userProfile={userProfile!}></ProfilePage>
  );
}

export default CheckProfilePage;
