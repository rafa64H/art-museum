import Header from "../components/Header";
import ComponentAccountSettings from "../components/ComponentAccountSettings";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import { UserDataResponse } from "../types/userDataResponse";
import {
  getFollowersFromUser,
  getFollowingsFromUser,
} from "../utils/fetchFunctions";
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
        if (user.userData?._id) {
          const responseGetFollowersFromUser = await getFollowersFromUser();

          const responseGetFollowersFromUserData =
            await responseGetFollowersFromUser.data;

          const responseGetFollowingFromUser = await getFollowingsFromUser();

          const responseGetFollowingFromUserData =
            await responseGetFollowingFromUser.data;

          setFollowersObjects(responseGetFollowersFromUserData.followers);
          setFollowingObjects(responseGetFollowingFromUserData.following);
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
  }, [user.userData?._id]);
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
