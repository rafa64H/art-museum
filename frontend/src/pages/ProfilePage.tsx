import React from "react";
import Header from "../components/Header";
import { RootState } from "../services/redux-toolkit/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { UserReduxToolkit } from "../services/redux-toolkit/auth/authSlice";

type Props = {
  isUserProfile: boolean;
  userProfile?: { profilePictureURL: string; username: string; name: string };
  getUserProfileLoading?: boolean;
};
function ProfilePage({
  isUserProfile,
  userProfile,
  getUserProfileLoading,
}: Props) {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <>
      <Header></Header>

      <section className="bg-mainBg p-8 text-white text-center">
        {isUserProfile ? (
          <>
            <img
              className="mx-auto w-[10rem] h-[10rem] rounded-full"
              src={`${user.userData?.profilePictureURL}`}
            ></img>
            <h1 className="text-3xl font-semibold">{user.userData?.name}</h1>
            <p className="text-xl">{user.userData?.username}</p>
            <Link to={"/account-settings"}>
              <i className="fa-solid fa-cog text-3xl"></i>
            </Link>
          </>
        ) : getUserProfileLoading ? (
          <>
            <h1 className="py-8 text-center font-semibold text-3xl">
              Loading profile...
            </h1>
          </>
        ) : (
          <>
            <img
              className="mx-auto w-[10rem] h-[10rem] rounded-full"
              src={`${userProfile?.profilePictureURL}`}
            ></img>
            <h1 className="text-3xl font-semibold">{userProfile?.name}</h1>
            <p className="text-xl">{userProfile?.username}</p>
          </>
        )}
      </section>
    </>
  );
}

export default ProfilePage;
