import React from "react";
import ButtonComponent from "./ui/ButtonComponent";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";

type Props = {
  imageURLState: string | undefined;
  imageFileState: File | null;
  setImageURLState: React.Dispatch<React.SetStateAction<string | undefined>>;
  setImageFileState: React.Dispatch<React.SetStateAction<File | null>>;
  labelText: string;
  typeOfImage: "profilePicture" | "post";
  imageWidth?: string;
};
function ImageInput({
  imageURLState,
  imageFileState,
  setImageURLState,
  setImageFileState,
  labelText,
  typeOfImage,
  imageWidth,
}: Props) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setImageFileState(selectedFile);
      setImageURLState(URL.createObjectURL(selectedFile));
      console.log(selectedFile);
    }
  };

  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      <img
        className={imageWidth ? imageWidth : "w-[10rem]"}
        src={
          imageURLState
            ? imageURLState
            : typeOfImage === "profilePicture"
            ? user.userData?.profilePictureURL
            : undefined
        }
      ></img>

      <label
        htmlFor="imageFileInput"
        className="bg-firstBrown hover:bg-firstGreen mt-2 p-3 font-semibold text-white duration-150 cursor-pointer inline-block"
      >
        <i className="fa-solid fa-upload"></i> {labelText}
      </label>

      {imageFileState ? (
        <ButtonComponent
          additionalClassnames="ml-2"
          textBtn="Cancel"
          typeButton="button"
          onClickFunction={() => {
            setImageFileState(null);
            setImageURLState(undefined);
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
  );
}

export default ImageInput;
