import Header from "../components/Header";
import ComponentAccountSettings from "../components/ComponentAccountSettings";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import { UserDataResponse } from "../types/userDataResponse";
import { getFollowersAndFollowings } from "../utils/fetchFunctions";
import { isAxiosError } from "axios";

function AccountSettingsPage() {
  const [followersObjects, setFollowersObjects] = useState<
    UserDataResponse[] | string | null
  >(null);
  const [followingObjects, setFollowingObjects] = useState<
    UserDataResponse[] | string | null
  >(null);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const getFollowers = async () => {
      try {
        if (user.userData?.id) {
          const responseGetFollowersFollowing =
            await getFollowersAndFollowings();
          console.log(responseGetFollowersFollowing);

          const responseGetFollowersFollowingData =
            await responseGetFollowersFollowing.data;
          console.log(responseGetFollowersFollowingData);

          setFollowersObjects(responseGetFollowersFollowingData.followers);
          setFollowingObjects(responseGetFollowersFollowingData.following);
        }
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response) {
            setFollowersObjects("Error, try again later or try to reload page");
            setFollowingObjects("Error, try again later or try to reload page");
          }
        }
        console.log(error);
      }
    };

    getFollowers();
  }, [user.userData?.id]);
  return (
    <>
      <Header></Header>
      <div className="bg-mainBg text-white">
        <ComponentAccountSettings
          followersObjects={followersObjects}
          followingObjects={followingObjects}
          setFollowersObjects={setFollowersObjects}
          setFollowingObjects={setFollowingObjects}
        ></ComponentAccountSettings>
      </div>
    </>
  );
}

export default AccountSettingsPage;
