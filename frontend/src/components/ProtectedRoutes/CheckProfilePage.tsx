import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../services/redux-toolkit/store";
import ProfilePage from "../../pages/ProfilePage";
import { BACKEND_URL } from "../../constants";

function CheckProfilePage() {
  const [getUserProfileLoading, setGetUserProfileLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const params = useParams();

  const userIdParam = params.userId;

  useEffect(() => {
    async function getUser() {
      try {
        const url = `${BACKEND_URL}/api/users/${userIdParam}`;

        const responseGetUser = await fetch(url, {
          method: "GET",
          headers: {
            authorization: `Bearer ${user.userData?.accessToken}`,
          },
        });

        if (responseGetUser.status === 200) {
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
      getUser();
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
