import { useRef, useState } from "react";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import TextInput from "../components/ui/TextInput";
import ButtonComponent from "../components/ui/ButtonComponent";
import { useNavigate } from "react-router-dom";
import MultipleImagesInput from "../components/MultipleImagesInput";
import requestAccessTokenRefresh from "../utils/requestAccessTokenRefresh";
import { v4 as uuidv4 } from "uuid";
import InputTextArea from "../components/ui/InputTextArea";
import { createPost, uploadPostImages } from "../utils/fetchFunctions";
import { isAxiosError } from "axios";

function CreatePostPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [imageFiles, setImageFiles] = useState<File[] | null>(null);
  const [imageURLs, setImageURLs] = useState<string[] | undefined>(undefined);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [tagsState, setTags] = useState<string[] | []>(["React", "Nodejs"]);

  //If there is no prevValue state, then when removing
  //the last character from the tags input, it will remove a tag.
  //If you can solve this problem without using state, you can help :)
  const [inputTagPrevValue, setInputTagPrevValue] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  function handleTagInputKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Delete" || event.key === "Backspace") {
      //To not trigger re-render each time pressing "Backspace" or "Delete"
      if (tagRef.current!.value.length <= 1) {
        setInputTagPrevValue(tagRef.current!.value);
      }

      if (tagRef.current!.value === "" && inputTagPrevValue === "") {
        setTags(
          tagsState.filter((tag, index) => index !== tagsState.length - 1)
        );
      }
    }

    if (event.key === "Enter" && tagRef.current!.value !== "") {
      const newTagValue = tagRef.current!.value;
      const newTagValueModified = newTagValue
        .split(" ")
        .join("")
        .toLocaleLowerCase();
      setTags([...tagsState, newTagValueModified]);
      tagRef.current!.value = "";
    }
  }

  return (
    <>
      <Header></Header>
      <section className="bg-mainBg text-white px-4 py-8">
        <h1 className="text-2xl mb-2 font-semibold">Create Post</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <MultipleImagesInput
            imagesFileState={imageFiles}
            imagesURLState={imageURLs}
            setImagesFileState={setImageFiles}
            setImagesURLState={setImageURLs}
            labelText="Upload images"
            typeOfImage="post"
          ></MultipleImagesInput>

          <p className="text-red-700 text-lg">{alertMessage}</p>

          <TextInput
            idFor="title"
            label="Title"
            placeholder="Title"
            refProp={titleRef}
            type="text"
          ></TextInput>

          <InputTextArea
            refProp={contentRef}
            smallOrLarge="large"
            idAndFor="contentText"
            placeholder="Write your post's content"
            textLabel="Content"
          ></InputTextArea>

          <div className="flex flex-wrap bg-white border-2 p-1 border-solid border-black">
            <ul className="">
              {tagsState.map((tag, index) => (
                <li
                  className="inline-block pl-2 cursor-default mx-2 font-semibold bg-firstGreen rounded-full"
                  key={uuidv4()}
                >
                  {tag}
                  <button>
                    {/*When pressing enter adding a new tag, 
                    if the onClick is on the <button> it will be
                    triggered
                    */}
                    <div
                      onClick={() => {
                        setTags(tagsState.filter((_, i) => i !== index));
                      }}
                      className="bg-firstLavender p-2 transition-all duration-150 hover:bg-firstBrown ml-2 rounded-full"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            <input
              className="inline-block flex-grow text-black"
              type="text"
              ref={tagRef}
              onKeyUp={(e) => {
                handleTagInputKeyUp(e);
              }}
            ></input>
          </div>

          <ButtonComponent
            textBtn="Post"
            typeButton="button"
            loadingDisabled={formSubmitLoading}
            onClickFunction={async () => {
              setFormSubmitLoading(true);

              let responsePostImagesData = null;

              try {
                const responseAccessTokenRefresh =
                  await requestAccessTokenRefresh();
                // if (!responseAccessTokenRefresh.ok) {
                //   navigate("/login");
                // }

                if (!user.userData?.verified) {
                  setAlertMessage("To post you need to verify your email");

                  setFormSubmitLoading(false);
                  return;
                }

                if (imageFiles) {
                  const formData = new FormData();
                  imageFiles.forEach((file) => {
                    formData.append("files", file);
                  });

                  const responsePostImage = await uploadPostImages(formData);

                  responsePostImagesData = await responsePostImage.data;
                }

                const imageURLsStrings =
                  responsePostImagesData.imageIdsAndUrls.map(
                    (obj: { imageURL: string; imageId: string }) => {
                      return obj.imageURL;
                    }
                  ) as string[];

                const imageIdsStrings =
                  responsePostImagesData.imageIdsAndUrls.map(
                    (obj: { imageId: string; imageURL: string }) => {
                      return obj.imageId;
                    }
                  ) as string[];

                // //Post model
                const data = {
                  title: titleRef.current?.value,
                  content: contentRef.current?.value,
                  imageURLs: imageURLsStrings,
                  imageIds: imageIdsStrings,
                  tags: tagsState,
                };
                const responsePostModel = await createPost(data);

                const responsePostModelData = await responsePostModel.data;

                setFormSubmitLoading(false);
                navigate(`/post/${responsePostModelData.post._id}`, {
                  replace: true,
                });

                return;
              } catch (error) {
                if (isAxiosError(error)) {
                  if (error.response) {
                    if (error.response.status === 400) {
                      setAlertMessage(error.response.data.message);
                    }
                    setFormSubmitLoading(false);
                    setAlertMessage("Error uploading post");
                    return;
                  }
                }
                console.log(error);
              }
            }}
          ></ButtonComponent>
        </form>
      </section>
    </>
  );
}

export default CreatePostPage;
