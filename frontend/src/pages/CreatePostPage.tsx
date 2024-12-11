import { useRef, useState } from "react";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import { BACKEND_URL } from "../constants";
import TextInput from "../components/ui/TextInput";
import ButtonComponent from "../components/ui/ButtonComponent";
import { useNavigate } from "react-router-dom";
import MultipleImagesInput from "../components/MultipleImagesInput";

function CreatePostPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [imageFiles, setImageFiles] = useState<File[] | null>(null);
  const [imageURLs, setImageURLs] = useState<string[] | undefined>(undefined);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();

  return (
    <>
      <Header></Header>
      <section className="bg-mainBg text-white px-2 py-4">
        <h1 className="text-2xl font-semibold">Create Post</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setFormSubmitLoading(true);

            let responsePostImagesData = null;

            try {
              if (imageFiles) {
                const formData = new FormData();
                imageFiles.forEach((file) => {
                  formData.append("files", file);
                });

                const urlPostImages = `${BACKEND_URL}/api/images/postImages`;
                const responsePostImage = await fetch(urlPostImages, {
                  method: "POST",
                  mode: "cors",
                  credentials: "include",
                  headers: {
                    authorization: `Bearer ${user.userData?.accessToken}`,
                  },
                  body: formData,
                });

                if (!responsePostImage.ok) {
                  setFormSubmitLoading(false);
                  return;
                }

                responsePostImagesData = await responsePostImage.json();
              }

              console.log(responsePostImagesData);

              const imageURLsStrings =
                responsePostImagesData.imageIdsAndUrls.map(
                  (obj: { imageURL: string; imageId: string }) => {
                    return obj.imageURL;
                  }
                );

              const imageIdsStrings =
                responsePostImagesData.imageIdsAndUrls.map(
                  (obj: { imageId: string; imageURL: string }) => {
                    return obj.imageId;
                  }
                );

              // //Post model
              const data = {
                title: titleRef.current!.value,
                content: contentRef.current!.value,
                imageURLs: imageURLsStrings,
                imageIds: imageIdsStrings,
              };
              const urlCreatePost = `${BACKEND_URL}/api/posts`;
              const responsePostModel = await fetch(urlCreatePost, {
                method: "POST",
                headers: {
                  authorization: `Bearer ${user.userData?.accessToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              });

              if (responsePostModel.ok) {
                setFormSubmitLoading(false);
                const responsePostModelData = await responsePostModel.json();
                navigate(`/post/${responsePostModelData.post._id}`, {
                  replace: true,
                });

                return;
              }
            } catch (error) {
              console.log(error);
            }
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

          <TextInput
            idFor="title"
            label="Title"
            placeholder="Title"
            refProp={titleRef}
            type="text"
          ></TextInput>

          <div className="w-[min(45rem,100%)] flex flex-col mb-4 lg:grid lg:grid-cols-3">
            <label htmlFor="content">Content:</label>
            <textarea
              className="border-2 mt-2 lg:mt-0 lg:col-span-2 border-black resize-none p-2 text-black data-[error-input=true]:border-red-700"
              id="content"
              placeholder="Write text content from your post"
              ref={contentRef}
            ></textarea>
          </div>
          <ButtonComponent
            textBtn="Post"
            typeButton="submit"
            loadingDisabled={formSubmitLoading}
          ></ButtonComponent>
        </form>
      </section>
    </>
  );
}

export default CreatePostPage;
