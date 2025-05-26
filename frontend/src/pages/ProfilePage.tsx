import React, { startTransition, useActionState, useState } from "react";
import Header from "../components/Header";
import { RootState } from "../services/redux-toolkit/store";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  setUserFollowing,
  UserData,
} from "../services/redux-toolkit/auth/authSlice";
import ButtonComponent from "../components/ui/ButtonComponent";
import { addFollow, deleteFollow } from "../utils/fetchFunctions";

type Props = {
  isUserProfile: boolean;
  userProfile?: UserData;
  getUserProfileLoading?: boolean;
};
function ProfilePage({
  isUserProfile,
  userProfile,
  getUserProfileLoading,
}: Props) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [followOrUnfollowLoading, setFollowOrUnfollowLoading] = useState(false);
  const [followOrUnfollowReturnData, followOrUnfollowAction, isPendingFollow] =
    useActionState(async () => {
      try {
        console.log(userProfile);
        if (!user.userData || !userProfile) {
          navigate("/sign-up");
          return;
        }
        const isUserFollowing = user.userData?.following.some(
          (id) => id === userProfile._id,
        );

        if (isUserFollowing) {
          const responseDeleteFollow = await deleteFollow(userProfile?._id);
          const responseDeleteFollowData = await responseDeleteFollow.data;

          dispatch(setUserFollowing(responseDeleteFollowData.following));
          return null;
        }

        const responseAddFollow = await addFollow(userProfile?._id);
        const responseAddFollowData = await responseAddFollow.data;
        dispatch(setUserFollowing(responseAddFollowData.following));
      } catch (error: unknown) {
        console.log(error);
        return error;
      }
    }, null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
            {userProfile?.following.some((id) => id === user.userData?._id) ? (
              <>
                <p className="text-lg">This person is following you</p>
              </>
            ) : (
              <></>
            )}
            <ButtonComponent
              typeButton="button"
              textBtn={
                user.userData?.following.some((id) => id === userProfile?._id)
                  ? "Unfollow"
                  : "Follow"
              }
              loadingDisabled={isPendingFollow}
              onClickFunction={async () => {
                startTransition(followOrUnfollowAction);
              }}
            ></ButtonComponent>
          </>
        )}
      </section>
    </>
  );
}

export default ProfilePage;
