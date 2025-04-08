import { useActionState, useRef, useState } from "react";
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
import { UserDataResponse } from "../types/userDataResponse";
import ImageInput from "./ImageInput";
import {
  changePassword,
  deleteFollow,
  editAccountInformation,
  requestEmailChangeCode,
  undoEmailChange,
} from "../utils/fetchFunctions";
import { isAxiosError } from "axios";

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
  const [submitFormLoading, setSubmitFormLoading] = useState(false);
  const [
    sendEmailVerificationLinkLoading,
    setSendEmailVerificationLinkLoading,
  ] = useState(false);
  const [undoChangedEmailLoading, setUndoChangedEmailLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordToVerifyOneRef = useRef<HTMLInputElement>(null);
  const passwordToVerifyTwoRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmNewPasswordRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

      <form
        className={`ml-2 mt-8 ${selectedOption === 1 ? "block" : "hidden"}`}
        action={editAccountInformationAction}
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
          idForAndName="imageInputProfilePicture"
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
                  if (isAxiosError(error)) {
                    if (error.response) {
                      if (error.response.status === 404) {
                        setAlertMessage(error.response.data.message);
                        setSendEmailVerificationLinkLoading(false);
                        return;
                      }
                      setAlertMessage("Internal server error, try again later");
                      setSendEmailVerificationLinkLoading(false);
                    }
                  }
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
          idForAndName="newEmail"
          label="Change email"
          placeholder="Change your email"
          refProp={emailRef}
          defaultValueProp={user.userData?.email}
          disabledProp={!user.userData?.verified || user.userData?.changedEmail}
          type="email"
        ></TextInput>
        <TextInput
          idForAndName="newName"
          label="Change name"
          placeholder="Change your name"
          refProp={nameRef}
          defaultValueProp={user.userData?.name}
          type="text"
        ></TextInput>
        <TextInput
          idForAndName="newUsername"
          label="Change username"
          placeholder="Change your username"
          refProp={usernameRef}
          defaultValueProp={user.userData?.username}
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
        <span
          className="text-xl font-bold text-red-400"
          role="alert"
          aria-live="assertive"
        >
          {alertMessage}
        </span>

        <TextInput
          idForAndName="newPassword"
          label="Change password"
          placeholder="Change your password"
          refProp={newPasswordRef}
          type="password"
        ></TextInput>
        <TextInput
          idForAndName="confirmPassword"
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
