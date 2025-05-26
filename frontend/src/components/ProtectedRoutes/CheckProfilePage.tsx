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

        const responseGetUserData = await responseGetUser.data;
        const userData = {
          ...responseGetUserData.user,
        };

        setUserProfile(userData);
        setGetUserProfileLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    if (userIdParam === user.userData?._id) {
      setGetUserProfileLoading(false);
    } else {
      getUserFunction();
    }
  }, [
    dispatch,
    navigate,
    user.userData?.accessToken,
    user.userData?._id,
    userIdParam,
  ]);

  if (userIdParam === user.userData?._id) {
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
