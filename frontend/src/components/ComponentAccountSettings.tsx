import { useRef, useState } from "react";
import MultipleSelectButton from "./ui/MultipleSelectButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import TextInput from "./ui/TextInput";
import ButtonComponent from "./ui/ButtonComponent";
import checkEmptyFieldsForm from "../utils/forms/checkEmptyFieldsForm";
import checkValidityNameOrUsername from "../utils/forms/checkValidityNameUsername";
import checkPasswordsMatch from "../utils/forms/checkPasswordsMatch";
import checkValidityPassword from "../utils/forms/checkValidityPassword";
import requestAccessTokenRefresh from "../utils/requestAccessTokenRefresh";
import { Link, useNavigate } from "react-router-dom";
import {
  setUserFollowers,
  setUserFollowing,
} from "../services/redux-toolkit/auth/authSlice";
import { UserDataResponse } from "../types/userDataResponse";
import ImageInput from "./ImageInput";
import {
  changePassword,
  deleteFollow,
  editAccountInformation,
  requestEmailChangeCode,
  undoEmailChange,
  uploadImageProfilePicture,
} from "../utils/fetchFunctions";
import { AxiosError, isAxiosError } from "axios";

type Props = {
  followersObjects: UserDataResponse[] | string | null;
  followingObjects: UserDataResponse[] | string | null;
  setFollowersObjects: React.Dispatch<
    React.SetStateAction<UserDataResponse[] | string | null>
  >;
  setFollowingObjects: React.Dispatch<
    React.SetStateAction<UserDataResponse[] | string | null>
  >;
};

function ComponentAccountSettings({
  followersObjects,
  followingObjects,
  setFollowersObjects,
  setFollowingObjects,
}: Props) {
  const [selectedOption, setSelectedOption] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertMessage2, setAlertMessage2] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | undefined>(undefined);
  const [submitFormLoading, setSubmitFormLoading] = useState(false);
  const [
    sendEmailVerificationLinkLoading,
    setSendEmailVerificationLinkLoading,
  ] = useState(false);
  const [undoChangedEmailLoading, setUndoChangedEmailLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const passwordDialogRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
          Introduce your current password before changing information, page will
          reload after change.
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
            setSubmitFormLoading(true);

            const email = emailRef.current!.value;
            const name = nameRef.current!.value;
            const username = usernameRef.current!.value;
            const verifyPassword = passwordDialogRef.current!.value;
            const newPassword = passwordRef.current!.value;

            try {
              const responseRequestTokenRefresh =
                await requestAccessTokenRefresh();
              if (responseRequestTokenRefresh.status === 401) {
                navigate("/", { replace: true });
                return;
              }

              if (selectedOption === 1) {
                const dataToEditAccount = {
                  newEmail: email !== user.userData!.email ? email : null,
                  newName: name !== user.userData!.name ? name : null,
                  newUsername:
                    username !== user.userData!.username ? username : null,
                  password: verifyPassword,
                };

                const responseEditAccount = await editAccountInformation(
                  dataToEditAccount
                );

                if (imageFile) {
                  const formData = new FormData();
                  formData.append("file", imageFile);

                  const responseProfilePictureUpload =
                    await uploadImageProfilePicture(formData);
                  navigate(0);
                  return;
                }

                navigate(0);
              }

              if (selectedOption === 2) {
                const dataToChangePassword = {
                  newPassword: newPassword,
                  password: verifyPassword,
                };
                if (!newPassword) return;

                const responseChangePassword = await changePassword(
                  dataToChangePassword
                );

                if (!responseChangePassword) return;

                setAlertMessage("Password changed");
                setOpenModal(false);
                setSubmitFormLoading(false);

                setAlertMessage2("Internal server error, try again later.");
                setSubmitFormLoading(false);
              }
            } catch (error) {
              if (isAxiosError(error)) {
                if (error.response) {
                  if (error.response.status === 401) {
                    const responseDataEditAccount = error.response.data.message;

                    if (error.response.data.message.includes("Unauthorized")) {
                      navigate("/", { replace: true });
                      return;
                    }

                    setAlertMessage2(responseDataEditAccount.message);
                    setSubmitFormLoading(false);
                    return;
                  }
                }
              }

              setOpenModal(false);
              setAlertMessage("Internal server error, try again later");
              setSubmitFormLoading(false);
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
            loadingDisabled={submitFormLoading}
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
        <MultipleSelectButton
          textBtn="Following"
          typeButton="button"
          buttonActivated={selectedOption === 3}
          onClickFunction={() => {
            setSelectedOption(3);
          }}
        ></MultipleSelectButton>
        <MultipleSelectButton
          textBtn="Followers"
          typeButton="button"
          buttonActivated={selectedOption === 4}
          onClickFunction={() => {
            setSelectedOption(4);
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
        <ImageInput
          imageURLState={imageURL}
          imageFileState={imageFile}
          setImageURLState={setImageURL}
          setImageFileState={setImageFile}
          labelText="Change profile picture"
          typeOfImage="profilePicture"
        ></ImageInput>

        {!user.userData?.verified ? (
          <>
            <p className="text-lg font-bold">
              Email not verified, click the button to send a code to verify it:
            </p>
            <ButtonComponent
              textBtn="Send code to email"
              typeButton="button"
              loadingDisabled={sendEmailVerificationLinkLoading}
              onClickFunction={async () => {
                try {
                  setSendEmailVerificationLinkLoading(true);
                  const userId = user.userData?.id;
                  const responseSendVerificationCode =
                    await requestEmailChangeCode(userId);

                  navigate(`/verify-email/${user.userData?.id}`);
                  return;
                } catch (error) {
                  setAlertMessage("An error occurred, try again later.");
                  setSendEmailVerificationLinkLoading(false);
                  console.log(error);
                }
              }}
            ></ButtonComponent>
          </>
        ) : (
          <></>
        )}

        {user.userData?.changedEmail ? (
          <>
            <p className="text-lg mt-8">
              Email changed, press the button if you want to undo the change{" "}
              {user.userData.previousEmail}
            </p>
            <ButtonComponent
              textBtn="Change to previous email"
              typeButton="button"
              additionalClassnames="mb-8"
              loadingDisabled={undoChangedEmailLoading}
              onClickFunction={async () => {
                try {
                  setUndoChangedEmailLoading(true);
                  const responseUndoEmailChange = await undoEmailChange();

                  setUndoChangedEmailLoading(false);
                  navigate(0);
                } catch (error) {
                  setUndoChangedEmailLoading(false);
                  console.log(error);
                }
              }}
            ></ButtonComponent>
          </>
        ) : (
          <></>
        )}
        <TextInput
          idFor="email"
          label="Change email"
          placeholder="Change your email"
          refProp={emailRef}
          defaultValueProp={user.userData?.email}
          disabledProp={!user.userData?.verified || user.userData?.changedEmail}
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

      <ul className={`ml-2 mt-8 ${selectedOption === 3 ? "block" : "hidden"}`}>
        {followingObjects === null ? (
          <>
            <h2 className="p-2 text-2xl font-semibold">Loading...</h2>
          </>
        ) : typeof followersObjects === "string" ? (
          <>
            <h2 className="p-2 text-2xl font-semibold">Error, reload page</h2>
          </>
        ) : followingObjects.length === 0 ? (
          <>
            <h2 className="p-2 text-2xl font-semibold">Nothing</h2>
          </>
        ) : (
          (followingObjects as UserDataResponse[]).map((userObject, index) => (
            <li className="inline-block relative" key={index}>
              <button
                type="button"
                className="absolute translate-y-[-73%] right-0 translate-x-[73%] text-xl hover:text-firstGreen"
                onClick={async () => {
                  try {
                    const isUserFollowing = user.userData?.following.some(
                      (id) => id === userObject.id
                    );
                    if (isUserFollowing) {
                      const responseDeleteFollow = await deleteFollow(
                        userObject?.id
                      );

                      const responseDeleteFollowData =
                        await responseDeleteFollow.data;

                      dispatch(
                        setUserFollowing(
                          responseDeleteFollowData.userRequestFollowing
                        )
                      );

                      //For some reason dispatch redux-toolkit
                      //doesn't re-render page
                      //If you know how to solve the error, you can help :)
                      setFollowingObjects(
                        responseDeleteFollowData.userRequestFollowing
                      );

                      console.log(responseDeleteFollowData);
                      return;
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <Link
                className="flex flex-col items-center border-2 border-transparent hover:border-firstGreen hover:text-firstGreen duration-150"
                to={`/profile/${userObject._id}`}
              >
                <img
                  src={userObject.profilePictureURL}
                  className="w-[5rem]"
                ></img>
                <p>{userObject.name}</p>
                <p>{userObject.username}</p>
              </Link>
            </li>
          ))
        )}
      </ul>

      <ul className={`ml-2 mt-8 ${selectedOption === 4 ? "block" : "hidden"}`}>
        {followersObjects === null ? (
          <>
            <h2 className="p-2 text-2xl font-semibold">Loading...</h2>
          </>
        ) : typeof followersObjects === "string" ? (
          <>
            <h2 className="p-2 text-2xl font-semibold">Error, reload page</h2>
          </>
        ) : followersObjects.length === 0 ? (
          <>
            <h2 className="p-2 text-2xl font-semibold">Nothing</h2>
          </>
        ) : (
          (followersObjects as UserDataResponse[]).map((userObject, index) => (
            <li className="inline-block relative" key={index}>
              <button
                type="button"
                className="absolute translate-y-[-73%] right-0 translate-x-[73%] text-xl hover:text-firstGreen"
                onClick={async () => {
                  try {
                    const isUserFollowing = user.userData?.following.some(
                      (id) => id === userObject._id
                    );
                    if (isUserFollowing) {
                      const responseDeleteFollow = await deleteFollow(
                        userObject?.id
                      );

                      const responseDeleteFollowData =
                        await responseDeleteFollow.data;

                      dispatch(
                        setUserFollowers(
                          responseDeleteFollowData.foundUserFollowers
                        )
                      );

                      setFollowersObjects(
                        responseDeleteFollowData.foundUserFollowers
                      );

                      console.log(responseDeleteFollowData);
                      return;
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
              <Link
                className="flex flex-col items-center border-2 border-transparent hover:border-firstGreen hover:text-firstGreen duration-150"
                to={`/profile/${userObject._id}`}
              >
                <img
                  src={userObject.profilePictureURL}
                  className="w-[5rem]"
                ></img>
                <p>{userObject.name}</p>
                <p>{userObject.username}</p>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ComponentAccountSettings;
