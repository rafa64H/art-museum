import { useRef, useState } from "react";
import MultipleSelectButton from "./ui/MultipleSelectButton";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import TextInput from "./ui/TextInput";
import ButtonComponent from "./ui/ButtonComponent";
import checkEmptyFieldsForm from "../utils/forms/checkEmptyFieldsForm";
import checkValidityNameOrUsername from "../utils/forms/checkValidityNameUsername";
import checkPasswordsMatch from "../utils/forms/checkPasswordsMatch";
import checkValidityPassword from "../utils/forms/checkValidityPassword";
import { BACKEND_URL } from "../constants";
import requestAccessTokenRefresh from "../utils/requestAccessTokenRefresh";
import { useNavigate } from "react-router-dom";
import setUserStore from "../utils/setUserStore";

function ComponentAccountSettings() {
  const [selectedOption, setSelectedOption] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertMessage2, setAlertMessage2] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | undefined>(undefined);

  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const passwordDialogRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setImageFile(selectedFile);
      setImageURL(URL.createObjectURL(selectedFile));
      console.log(selectedFile);
    }
  };

  return (
    <div>
      <section
        data-open-modal={openModal}
        className="z-30 data-[open-modal='true']:scale-100 scale-0 duration-200 bg-slate-700 pt-4 pb-8 px-8 w-[min(80%,45rem)] fixed translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]"
      >
        <ButtonComponent
          textBtn="Close"
          additionalClassnames="block ml-auto text-xl p-4"
          typeButton="button"
          onClickFunction={() => setOpenModal((prevValue) => !prevValue)}
        ></ButtonComponent>

        <h2 className="font-bold my-8 text-xl">
          Introduce your current password before changing information
        </h2>

        <span
          className="text-xl font-bold text-red-400"
          role="alert"
          aria-live="assertive"
        >
          {alertMessage2}
        </span>

        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const email = emailRef.current!.value;
            const name = nameRef.current!.value;
            const username = usernameRef.current!.value;
            const verifyPassword = passwordDialogRef.current!.value;
            const newPassword = passwordRef.current!.value;

            try {
              const responseRequestTokenRefresh =
                await requestAccessTokenRefresh();
              if (responseRequestTokenRefresh.status === 401) {
                return;
              }

              if (selectedOption === 1) {
                const url = `${BACKEND_URL}/account/edit-account`;

                const data = {
                  newEmail: email !== user.userData!.email ? email : null,
                  newName: name !== user.userData!.name ? name : null,
                  newUsername:
                    username !== user.userData?.username ? username : null,
                  password: verifyPassword,
                };

                const responseEditAccount = await fetch(url, {
                  method: "PUT",
                  headers: {
                    authorization: `Bearer ${user.userData?.accessToken}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                });

                if (responseEditAccount.status === 401) {
                  const responseDataEditAccount =
                    await responseEditAccount.json();

                  if (
                    responseDataEditAccount.message.includes("Unauthorized")
                  ) {
                    navigate("/", { replace: true });
                    return;
                  }

                  setAlertMessage2(responseDataEditAccount.message);
                  return;
                }

                if (responseEditAccount.status === 200) {
                  if (imageFile) {
                    const formData = new FormData();
                    formData.append("file", imageFile);

                    const url = `${BACKEND_URL}/api/images/profilePictures`;

                    const responseProfilePictureUpload = await fetch(url, {
                      method: "POST",
                      mode: "cors",
                      credentials: "include",
                      headers: {
                        authorization: `Bearer ${user.userData?.accessToken}`,
                      },
                      body: formData,
                    });

                    const responseProfilePictureUploadData =
                      await responseProfilePictureUpload.json();

                    const newProfilePictureURL =
                      responseProfilePictureUploadData.profilePictureURL as string;

                    setUserStore(responseProfilePictureUploadData);
                    navigate(0);
                    return;
                  }

                  const responseEditAccountData =
                    await responseEditAccount.json();

                  console.log(responseEditAccountData);
                  setUserStore(responseEditAccountData);

                  setAlertMessage("User account edited");
                  setOpenModal(false);
                  setImageFile(null);
                  setImageURL(undefined);
                }
              }

              if (selectedOption === 2) {
                const url = `${BACKEND_URL}/account/change-password`;

                const data = {
                  newPassword: newPassword,
                  password: verifyPassword,
                };

                if (!newPassword) return;

                const responseChangePassword = await fetch(url, {
                  method: "PUT",
                  headers: {
                    authorization: `Bearer ${user.userData?.accessToken}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                });

                console.log(responseChangePassword);
                console.log(await responseChangePassword.json());
              }
            } catch (error) {
              setOpenModal(false);
              setAlertMessage("Internal server error");
              console.log(error);
            }
          }}
        >
          <TextInput
            idFor="authPassword"
            label="Introduce current password"
            placeholder="Confirm your current password"
            refProp={passwordDialogRef}
            type="password"
          ></TextInput>
          <ButtonComponent
            textBtn="Change account information"
            typeButton="submit"
          ></ButtonComponent>
        </form>
      </section>

      <div
        data-open-modal={openModal}
        className="data-[open-modal='true']:block hidden z-20 fixed top-0 w-[100%] h-[100%] bg-[rgba(0,0,0,0.6)]"
      ></div>

      <h1>Account Settings</h1>

      <section>
        <MultipleSelectButton
          textBtn="Account information"
          typeButton="button"
          buttonActivated={selectedOption === 1}
          onClickFunction={() => {
            setSelectedOption(1);
          }}
        ></MultipleSelectButton>
        <MultipleSelectButton
          textBtn="Change password"
          typeButton="button"
          buttonActivated={selectedOption === 2}
          onClickFunction={() => {
            setSelectedOption(2);
          }}
        ></MultipleSelectButton>
      </section>

      <form
        className={`ml-2 mt-8 ${selectedOption === 1 ? "block" : "hidden"}`}
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const allRefsCurrent = [
              emailRef.current!,
              nameRef.current!,
              usernameRef.current!,
            ];

            const name = nameRef.current!.value;
            const username = usernameRef.current!.value;

            if (!checkEmptyFieldsForm(allRefsCurrent, setAlertMessage)) {
              return;
            }

            if (
              !checkValidityNameOrUsername(
                name,
                nameRef.current!,
                setAlertMessage
              )
            ) {
              return;
            }
            if (
              !checkValidityNameOrUsername(
                username,
                usernameRef.current!,
                setAlertMessage
              )
            ) {
              return;
            }

            setOpenModal(true);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <span
          className="text-xl font-bold text-red-400"
          role="alert"
          aria-live="assertive"
        >
          {alertMessage}
        </span>
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
          idFor="email"
          label="Change email"
          placeholder="Change your email"
          refProp={emailRef}
          defaultValueProp={user.userData?.email}
          type="email"
          additionalFunction={() => {
            setAlertMessage("");
          }}
        ></TextInput>
        <TextInput
          idFor="name"
          label="Change name"
          placeholder="Change your name"
          refProp={nameRef}
          defaultValueProp={user.userData?.name}
          type="text"
          additionalFunction={() => {
            setAlertMessage("");
          }}
        ></TextInput>
        <TextInput
          idFor="username"
          label="Change username"
          placeholder="Change your username"
          refProp={usernameRef}
          defaultValueProp={user.userData?.username}
          type="text"
          additionalFunction={() => {
            setAlertMessage("");
          }}
        ></TextInput>

        <ButtonComponent
          textBtn="Change information"
          typeButton="submit"
        ></ButtonComponent>
      </form>

      <form
        className={`ml-2 mt-8 ${selectedOption === 2 ? "block" : "hidden"}`}
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const allRefsCurrent = [
              passwordRef.current!,
              confirmPasswordRef.current!,
            ];

            const password = passwordRef.current!.value;
            const confirmPassword = confirmPasswordRef.current!.value;

            if (!checkEmptyFieldsForm(allRefsCurrent, setAlertMessage)) {
              return;
            }

            if (
              !checkPasswordsMatch(
                password,
                confirmPassword,
                passwordRef.current!,
                confirmPasswordRef.current!,
                setAlertMessage
              )
            ) {
              return;
            }
            if (
              !checkValidityPassword(
                password,
                passwordRef.current!,
                setAlertMessage
              )
            ) {
              return;
            }

            setOpenModal(true);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <span
          className="text-xl font-bold text-red-400"
          role="alert"
          aria-live="assertive"
        >
          {alertMessage}
        </span>

        <TextInput
          idFor="changePassword"
          label="Change password"
          placeholder="Change your password"
          refProp={passwordRef}
          type="password"
          additionalFunction={() => {
            setAlertMessage("");
          }}
        ></TextInput>
        <TextInput
          idFor="confirmPassword"
          label="Confirm new password"
          placeholder="Confirm new password"
          refProp={confirmPasswordRef}
          type="password"
          additionalFunction={() => {
            setAlertMessage("");
          }}
        ></TextInput>

        <ButtonComponent
          textBtn="Change password"
          typeButton="submit"
        ></ButtonComponent>
      </form>
    </div>
  );
}

export default ComponentAccountSettings;
