import { useRef, useState } from "react";
import MultipleSelectButton from "./ui/MultipleSelectButton";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import TextInput from "./ui/TextInput";
import ButtonComponent from "./ui/ButtonComponent";

function ComponentAccountSettings() {
  const [selectedOption, setSelectedOption] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertMessage2, setAlertMessage2] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const passwordDialogRef = useRef<HTMLInputElement>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div>
      <section
        data-open-modal={openModal}
        className="z-30 data-[open-modal='true']:scale-100 scale-0 duration-200 bg-slate-700 pt-4 pb-8 px-8 w-[min(80%,45rem)] absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]"
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
          onSubmit={(e) => {
            e.preventDefault();
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
        className="data-[open-modal='true']:block hidden z-20 absolute w-[100%] h-[100%] bg-[rgba(0,0,0,0.6)]"
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
      </section>

      <form
        className="ml-2 mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          setOpenModal(true);
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
          idFor="email"
          label="Change email"
          placeholder="Change your email"
          refProp={emailRef}
          defaultValueProp={user.userData?.email}
          type="email"
        ></TextInput>
        <TextInput
          idFor="name"
          label="Change name"
          placeholder="Change your name"
          refProp={nameRef}
          defaultValueProp={user.userData?.name}
          type="text"
        ></TextInput>
        <TextInput
          idFor="username"
          label="Change username"
          placeholder="Change your username"
          refProp={usernameRef}
          defaultValueProp={user.userData?.username}
          type="text"
        ></TextInput>

        <TextInput
          idFor="changePassword"
          label="Change password"
          placeholder="Change your password"
          refProp={passwordRef}
          type="password"
        ></TextInput>
        <TextInput
          idFor="confirmPassword"
          label="Confirm new password"
          placeholder="Confirm new password"
          refProp={confirmPasswordRef}
          type="password"
        ></TextInput>

        <ButtonComponent
          textBtn="Change information"
          typeButton="submit"
        ></ButtonComponent>
      </form>
    </div>
  );
}

export default ComponentAccountSettings;
