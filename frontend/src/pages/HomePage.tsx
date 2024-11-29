import React, { useRef, useState } from "react";
import Header from "../components/Header";
import { BACKEND_URL } from "../constants";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import ButtonComponent from "../components/ui/ButtonComponent";
import TextInput from "../components/ui/TextInput";

function HomePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | undefined>(undefined);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setImageFile(selectedFile);
      setImageURL(URL.createObjectURL(selectedFile));
      console.log(selectedFile);
    }
  };

  return (
    <>
      <Header></Header>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            if (!imageFile) return;

            const formData = new FormData();
            formData.append("file", imageFile);

            const url2 = `${BACKEND_URL}/api/images/postImages`;

            const responsePostImage = await fetch(url2, {
              method: "POST",
              mode: "cors",
              credentials: "include",
              headers: {
                authorization: `Bearer ${user.userData?.accessToken}`,
              },
              body: formData,
            });

            console.log(responsePostImage);
            const responsePostImageData = await responsePostImage.json();

            //Post model
            const data = {
              title: titleRef.current!.value,
              content: contentRef.current!.value,
              imageURL: responsePostImageData.image.imageURL,
              imageId: responsePostImageData.image._id,
            };
            console.log(responsePostImageData);
            const url = `${BACKEND_URL}/api/posts`;
            const responsePostModel = await fetch(url, {
              method: "POST",
              headers: {
                authorization: `Bearer ${user.userData?.accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });

            console.log(responsePostModel);

            const responsePostModelData = await responsePostModel.json();

            console.log(responsePostModelData);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <div>
          <img
            className="w-[10rem]"
            src={imageURL ? imageURL : user.userData?.profilePictureURL}
          ></img>

          <label
            htmlFor="imageFileInput"
            className="bg-firstBrown hover:bg-firstGreen mt-2 p-3 font-semibold text-white duration-150 cursor-pointer inline-block"
          >
            <i className="fa-solid fa-upload"></i> Change profile picture
          </label>

          {imageFile ? (
            <ButtonComponent
              additionalClassnames="ml-2"
              textBtn="Cancel"
              typeButton="button"
              onClickFunction={() => {
                setImageFile(null);
                setImageURL(undefined);
              }}
            ></ButtonComponent>
          ) : (
            <></>
          )}

          <input
            id="imageFileInput"
            className="hidden"
            onChange={(e) => handleFileChange(e)}
            type="file"
            accept="image/*"
          ></input>
        </div>

        <TextInput
          idFor="title"
          label="Title"
          placeholder="Title"
          refProp={titleRef}
          type="text"
        ></TextInput>

        <TextInput
          idFor="content"
          label="Content"
          placeholder="Content"
          refProp={contentRef}
          type="text"
        ></TextInput>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default HomePage;
