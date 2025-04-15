import { useActionState, useEffect, useRef, useState } from "react";
import MultipleSelectButton from "./ui/MultipleSelectButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import TextInput from "./ui/TextInput";
import ButtonComponent from "./ui/ButtonComponent";
import { Link, useNavigate } from "react-router-dom";
import {
  setUserFollowers,
  setUserFollowing,
} from "../services/redux-toolkit/auth/authSlice";
import ImageInput from "./ImageInput";
import {
  changePassword,
  deleteFollow,
  editAccountInformation,
  requestEmailVerificationLink,
} from "../utils/fetchFunctions";
import { isAxiosError } from "axios";
import setUserStore from "../utils/setUserStore";
import {
  ResponseUserDataType,
  UserDataResponse,
} from "../types/userDataResponse";

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
  const [alertMessage, setAlertMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageURL, setImageURL] = useState<string | undefined>(undefined);
  const [
    returnDataAccountInformation,
    editAccountInformationAction,
    isPendingEditAccount,
  ] = useActionState(editAccountInformation, null);
  const [
    returnDataChangePassword,
    changePasswordAction,
    isPendingChangePassword,
  ] = useActionState(changePassword, null);
  const [
    sendEmailVerificationLinkLoading,
    setSendEmailVerificationLinkLoading,
  ] = useState(false);

  const [
    returnDataSendVerificationLink,
    sendEmailVerificationLinkAction,
    isPendingSendVerificationLink,
  ] = useActionState(requestEmailVerificationLink, null);

  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordToVerifyOneRef = useRef<HTMLInputElement>(null);

  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmNewPasswordRef = useRef<HTMLInputElement>(null);
  const passwordToVerifyTwoRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (returnDataAccountInformation) {
      if (
        typeof returnDataAccountInformation === "object" &&
        "error" in returnDataAccountInformation
      ) {
        if (returnDataAccountInformation.error.includes("email")) {
          emailRef.current?.setAttribute("data-error-input", "true");
        }
        if (returnDataAccountInformation.error.includes("username")) {
          usernameRef.current?.setAttribute("data-error-input", "true");
        }
        if (returnDataAccountInformation.error.includes("name")) {
          nameRef.current?.setAttribute("data-error-input", "true");
        }
        if (returnDataAccountInformation.error.includes("password")) {
          passwordToVerifyOneRef.current?.setAttribute(
            "data-error-input",
            "true"
          );
        }
      }

      if ("data" in returnDataAccountInformation) {
        const userDataToSet: ResponseUserDataType = {
          user: {
            ...returnDataAccountInformation.data.user,
          },
          accessToken: user.userData!.accessToken,
        };
        setUserStore(userDataToSet);
        setImageFile(null);
        setImageURL(undefined);
      }
    }
  }, [returnDataAccountInformation]);

  useEffect(() => {
    if (
      returnDataChangePassword &&
      typeof returnDataChangePassword === "object" &&
      "error" in returnDataChangePassword
    ) {
      if (returnDataChangePassword.error.includes("password")) {
        confirmNewPasswordRef.current?.setAttribute("data-error-input", "true");
        newPasswordRef.current?.setAttribute("data-error-input", "true");
        passwordToVerifyTwoRef.current?.setAttribute(
          "data-error-input",
          "true"
        );
      }
    }
  }, [returnDataChangePassword]);

  return (
    <div>
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

      {!user.userData?.verified ? (
        <form className="my-10" action={sendEmailVerificationLinkAction}>
          <p className="text-lg font-bold">
            Email not verified, click the button to send a code to verify it:
          </p>
          <ButtonComponent
            textBtn="Send code to email"
            typeButton="submit"
            loadingDisabled={isPendingSendVerificationLink}
          ></ButtonComponent>
          <p
            className={`text-lg ${
              returnDataSendVerificationLink &&
              "error" in returnDataSendVerificationLink
                ? "text-red-400"
                : "text-blue-400"
            }`}
          >
            {returnDataSendVerificationLink &&
            "error" in returnDataSendVerificationLink
              ? returnDataSendVerificationLink.error
              : returnDataSendVerificationLink
              ? "Email verification link sent to your email"
              : ""}
          </p>
        </form>
      ) : (
        <></>
      )}

      <form
        className={`ml-2 mt-8 ${selectedOption === 1 ? "block" : "hidden"}`}
        action={editAccountInformationAction}
      >
        <p
          className={`text-xl font-bold ${
            returnDataAccountInformation &&
            "error" in returnDataAccountInformation
              ? "text-red-400"
              : "text-blue-400"
          }`}
          role="alert"
          aria-live="assertive"
        >
          {returnDataAccountInformation &&
          typeof returnDataAccountInformation === "object" &&
          "data" in returnDataAccountInformation &&
          "message" in returnDataAccountInformation.data
            ? returnDataAccountInformation.data.message
            : returnDataAccountInformation &&
              "error" in returnDataAccountInformation
            ? returnDataAccountInformation.error
            : ""}
        </p>
        <ImageInput
          imageURLState={imageURL}
          imageFileState={imageFile}
          setImageURLState={setImageURL}
          setImageFileState={setImageFile}
          labelText="Change profile picture"
          typeOfImage="profilePicture"
          idForAndName="imageInputProfilePicture"
        ></ImageInput>

        <TextInput
          idForAndName="newEmail"
          label="Change email"
          placeholder="Change your email"
          refProp={emailRef}
          defaultValueProp={
            returnDataAccountInformation &&
            "error" in returnDataAccountInformation
              ? returnDataAccountInformation.previousData.newEmail?.toString()
              : user.userData?.email
          }
          disabledProp={!user.userData?.verified}
          type="email"
        ></TextInput>
        <TextInput
          idForAndName="newName"
          label="Change name"
          placeholder="Change your name"
          refProp={nameRef}
          defaultValueProp={
            returnDataAccountInformation &&
            "error" in returnDataAccountInformation
              ? returnDataAccountInformation.previousData.newName?.toString()
              : user.userData?.name
          }
          type="text"
        ></TextInput>
        <TextInput
          idForAndName="newUsername"
          label="Change username"
          placeholder="Change your username"
          refProp={usernameRef}
          defaultValueProp={
            returnDataAccountInformation &&
            "error" in returnDataAccountInformation
              ? returnDataAccountInformation.previousData.newUsername?.toString()
              : user.userData?.username
          }
          type="text"
        ></TextInput>

        <TextInput
          idForAndName="passwordToVerifyOne"
          label="Write your current password"
          placeholder="Current password"
          refProp={passwordToVerifyOneRef}
          type="password"
        ></TextInput>

        <ButtonComponent
          textBtn="Change information"
          loadingDisabled={isPendingEditAccount}
          typeButton="submit"
        ></ButtonComponent>
      </form>

      <form
        className={`ml-2 mt-8 ${selectedOption === 2 ? "block" : "hidden"}`}
        action={changePasswordAction}
      >
        <p
          className={`text-xl font-bold ${
            returnDataChangePassword && "error" in returnDataChangePassword
              ? "text-red-400"
              : "text-blue-400"
          }`}
          role="alert"
          aria-live="assertive"
        >
          {returnDataChangePassword &&
          "data" in returnDataChangePassword &&
          "message" in returnDataChangePassword.data
            ? returnDataChangePassword.data.message
            : returnDataChangePassword && "error" in returnDataChangePassword
            ? returnDataChangePassword.error
            : ""}
        </p>

        <TextInput
          idForAndName="newPassword"
          label="Change password"
          placeholder="Change your password"
          refProp={newPasswordRef}
          type="password"
        ></TextInput>
        <TextInput
          idForAndName="confirmNewPassword"
          label="Confirm new password"
          placeholder="Confirm new password"
          refProp={confirmNewPasswordRef}
          type="password"
        ></TextInput>

        <TextInput
          idForAndName="currentPassword"
          label="Write your current password"
          placeholder="Current password"
          refProp={passwordToVerifyTwoRef}
          type="password"
        ></TextInput>

        <ButtonComponent
          textBtn="Change password"
          typeButton="submit"
          loadingDisabled={isPendingChangePassword}
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
                      (id) => id === userObject._id
                    );

                    if (isUserFollowing) {
                      const responseDeleteFollow = await deleteFollow(
                        userObject._id
                      );

                      const responseDeleteFollowData =
                        await responseDeleteFollow.data;

                      console.log(responseDeleteFollowData);

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
                        userObject._id
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
