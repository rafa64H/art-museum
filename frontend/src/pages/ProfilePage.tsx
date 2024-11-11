import React from "react";
import Header from "../components/Header";
import { RootState } from "../services/redux-toolkit/store";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const params = useParams();
  return (
    <>
      <Header></Header>

      <section className="bg-mainBg p-8 text-white text-center">
        {params.userId === user.userData?.id ? (
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
        ) : (
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
        )}
      </section>
    </>
  );
}

export default ProfilePage;
