import React from "react";
import Header from "../components/Header";
import { BACKEND_URL } from "../constants";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import ButtonComponent from "../components/ui/ButtonComponent";

function HomePage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <>
      <Header></Header>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const url = `${BACKEND_URL}/api/users/`;
            const response = await fetch(url, {
              method: "GET",
              headers: {
                authorization: `Bearer ${user.userData?.accessToken}`,
              },
            });
            console.log("hola");

            console.log(response);
            console.log(await response.json());
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <ButtonComponent textBtn="get" typeButton="submit"></ButtonComponent>
      </form>
    </>
  );
}

export default HomePage;
