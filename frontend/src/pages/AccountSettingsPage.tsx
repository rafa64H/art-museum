import Header from "../components/Header";
import ComponentAccountSettings from "../components/ComponentAccountSettings";
import { BACKEND_URL } from "../constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";

function AccountSettingsPage() {
  const [followersObjects, setFollowersObjects] = useState<UserData[] | null>(
    null
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getFollowers = async () => {
      try {
        if (!user.userData?.id) {
          return;
        }
        const url = `${BACKEND_URL}/api/users/followers/${user.userData?.id}`;

        const responseGetFollowers = await fetch(url, {
          method: "GET",
        });

        const responseGetFollowersData = await responseGetFollowers.json();

        setFollowersObjects(responseGetFollowersData.following);
      } catch (error) {
        console.log(error);
      }
    };

    getFollowers();
  }, [user.userData?.accessToken, user.userData?.id]);
  return (
    <>
      <Header></Header>
      <div className="bg-mainBg text-white">
        <ComponentAccountSettings
          followersObjects={followersObjects}
        ></ComponentAccountSettings>
      </div>
    </>
  );
}

export default AccountSettingsPage;
