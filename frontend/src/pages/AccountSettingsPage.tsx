import Header from "../components/Header";
import ComponentAccountSettings from "../components/ComponentAccountSettings";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import { UserDataResponse } from "../types/userDataResponse";
import { getFollowersAndFollowings } from "../utils/fetchFunctions";

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
            await responseGetFollowersFollowing.json();
          console.log(responseGetFollowersFollowingData);
          if (responseGetFollowersFollowing.status === 200) {
            setFollowersObjects(responseGetFollowersFollowingData.followers);
            setFollowingObjects(responseGetFollowersFollowingData.following);
          }
          if (responseGetFollowersFollowing.status !== 200) {
            setFollowersObjects("Error, try again later or try to reload page");
            setFollowingObjects("Error, try again later or try to reload page");
          }
        }
      } catch (error) {
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
