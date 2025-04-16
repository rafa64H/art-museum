import React from "react";
import ButtonComponent from "./ui/ButtonComponent";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import { v4 as uuidv4 } from "uuid";

type Props = {
  imagesURLState: string[] | undefined;
  imagesFileState: File[] | null;
  setImagesURLState: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  setImagesFileState: React.Dispatch<React.SetStateAction<File[] | null>>;
  labelText: string;
  typeOfImage: "profilePicture" | "post";
  imagesWidth?: string;
};
function MultipleImagesInput({
  imagesURLState,
  imagesFileState,
  setImagesURLState,
  setImagesFileState,
  labelText,
  typeOfImage,
  imagesWidth,
}: Props) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? event.target.files : null;
    if (selectedFiles) {
      const selectedFilesArray = [...selectedFiles];
      setImagesFileState(selectedFilesArray);

      const arrayImageUrls: string[] = [];
      selectedFilesArray.forEach((file) => {
        const createdUrl = URL.createObjectURL(file);
        arrayImageUrls.push(createdUrl);
      });
      setImagesURLState(arrayImageUrls);
    }
  };

  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      <div className="flex flex-wrap gap-4 w-[min(90%,70rem)] ">
        {imagesURLState?.map((imageURL) => {
          return (
            <div key={uuidv4()} className="relative">
              <img
                className={
                  imagesWidth
                    ? `${imagesWidth} h-[100%] object-cover`
                    : "w-[10rem] h-[100%] object-cover"
                }
                src={
                  imageURL
                    ? imageURL
                    : typeOfImage === "profilePicture"
                    ? user.userData?.profilePictureURL
                    : undefined
                }
              ></img>
              <button
                type="button"
                onClick={() => {
                  const indexImageURL = imagesURLState.indexOf(imageURL);
                  const imageFileToRemove = imagesFileState![indexImageURL];
                  console.log(imagesFileState);
                  console.log(imagesURLState);
                  setImagesFileState((prevValue) =>
                    prevValue!.filter((file) => file !== imageFileToRemove)
                  );

                  setImagesURLState((prevValue) =>
                    prevValue?.filter((url) => url !== imageURL)
                  );
                }}
                className="absolute top-0 right-0 text-3xl px-2  bg-firstBrown hover:bg-firstGreen duration-150 transition-all rounded-full w-fit "
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          );
        })}
      </div>

      <label
        htmlFor="imageFileInput"
        className="bg-firstBrown hover:bg-firstGreen mt-2 p-3 font-semibold text-white duration-150 cursor-pointer inline-block"
      >
        <i className="fa-solid fa-upload"></i> {labelText}
      </label>

      {imagesFileState && imagesFileState.length > 0 ? (
        <ButtonComponent
          additionalClassnames="ml-2"
          textBtn="Cancel"
          typeButton="button"
          onClickFunction={() => {
            setImagesFileState(null);
            setImagesURLState(undefined);
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
        multiple
      ></input>
    </div>
  );
}

export default MultipleImagesInput;
