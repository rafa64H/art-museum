import React, { useState } from "react";
import Header from "../components/Header";
import { BACKEND_URL } from "../constants";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";

function HomePage() {
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (file) {
        // Logic to upload the file or perform some action

        const formData = new FormData();
        formData.append("file", file);

        const url = `${BACKEND_URL}/api/images/profilePictures`;

        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            authorization: `Bearer ${user.userData?.accessToken}`,
          },
          body: formData,
        });

        console.log(await response);

        console.log("File submitted:", file);
        return;
      }
      throw new Error("File not found");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header></Header>
      <form onSubmit={(e) => handleSubmit(e)}></form>
    </>
  );
}

export default HomePage;
