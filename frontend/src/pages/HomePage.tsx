import React, { useState } from "react";
import Header from "../components/Header";
import { BACKEND_URL } from "../constants";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";

function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      console.log(selectedFile);
    }
  };

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
            authorization: `Bearer ${user?.accessToken}`,
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
      <form onSubmit={(e) => handleSubmit(e)}>
        <input onChange={(e) => handleFileChange(e)} type="file"></input>
        <button type="submit">Upload Artwork</button>
      </form>
    </>
  );
}

export default HomePage;
