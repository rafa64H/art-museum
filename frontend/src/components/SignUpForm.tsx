import { useRef, useState } from "react";
import TextInput from "./ui/TextInput";
import { Link, useNavigate } from "react-router-dom";
import ButtonComponent from "./ui/ButtonComponent";
import checkEmptyFieldsForm from "../utils/forms/checkEmptyFieldsForm";
import checkPasswordsMatch from "../utils/forms/checkPasswordsMatch";
import checkValidityPassword from "../utils/forms/checkValidityPassword";
import checkValidityNameOrUsername from "../utils/forms/checkValidityNameUsername";
import setUserStoreLogin from "../utils/setUserStore";
import { createAccount } from "../utils/fetchFunctions";
import { isAxiosError } from "axios";

function SignUpForm() {
  const [alertMessage, setAlertMessage] = useState("");
  const [submitFormLoading, setSubmitFormLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  return (
    <form
      className="p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitFormLoading(true);
        try {
          const email = emailRef.current?.value;
          const username = usernameRef.current?.value;
          const name = nameRef.current?.value;
          const password = passwordRef.current?.value;
          const confirmPassword = confirmPasswordRef.current?.value;

          const allRefsCurrent = [
            emailRef.current!,
            usernameRef.current!,
            nameRef.current!,
            passwordRef.current!,
            confirmPasswordRef.current!,
          ];

          if (!checkEmptyFieldsForm(allRefsCurrent, setAlertMessage)) {
            setSubmitFormLoading(false);
            return;
          }

          if (
            !checkPasswordsMatch(
              password!,
              confirmPassword!,
              passwordRef.current!,
              confirmPasswordRef.current!,
              setAlertMessage
            )
          ) {
            setSubmitFormLoading(false);
            return;
          }

          if (
            !checkValidityPassword(
              password!,
              passwordRef.current!,
              setAlertMessage
            )
          ) {
            setSubmitFormLoading(false);
            return;
          }
          if (
            !checkValidityNameOrUsername(
              username!,
              usernameRef.current!,
              setAlertMessage
            )
          ) {
            setSubmitFormLoading(false);
            return;
          }
          if (
            !checkValidityNameOrUsername(
              name!,
              usernameRef.current!,
              setAlertMessage
            )
          ) {
            setSubmitFormLoading(false);
            return;
          }

          const data = {
            email,
            username,
            name,
            password,
          };
          const responseCreateAccount = await createAccount(data);

          const responseDataCreateAccount = await responseCreateAccount.data;

          setUserStoreLogin(responseDataCreateAccount);
          navigate("/");
        } catch (error) {
          if (isAxiosError(error)) {
            if (error.response) {
              if (error.response.status === 400) {
                setAlertMessage(`${error.response.data.message}`);
                setSubmitFormLoading(false);
                return;
              }

              setAlertMessage("Internal server error, try again later");
              setSubmitFormLoading(false);
              return;
            }
          }
          setAlertMessage("Internal server error, try again later");
          setSubmitFormLoading(false);
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
        idFor="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        refProp={emailRef}
        additionalFunction={() => {
          setAlertMessage("");
        }}
      ></TextInput>
      <TextInput
        idFor="username"
        label="Username"
        type="text"
        placeholder="Enter your username"
        refProp={usernameRef}
        additionalFunction={() => {
          setAlertMessage("");
        }}
      ></TextInput>
      <TextInput
        idFor="name"
        label="Name"
        type="text"
        placeholder="Enter your name"
        refProp={nameRef}
        additionalFunction={() => {
          setAlertMessage("");
        }}
      ></TextInput>
      <TextInput
        idFor="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        refProp={passwordRef}
        additionalFunction={() => {
          setAlertMessage("");
        }}
      ></TextInput>
      <TextInput
        idFor="confirmPassword"
        label="Confirm password"
        type="password"
        placeholder="Repeat your password"
        refProp={confirmPasswordRef}
        additionalFunction={() => {
          setAlertMessage("");
        }}
      ></TextInput>

      <ButtonComponent
        textBtn="Sign up"
        typeButton="submit"
        loadingDisabled={submitFormLoading}
      ></ButtonComponent>

      <p className="mt-4">
        <Link className="hover:underline" to="/login">
          Already have account? Click here
        </Link>
      </p>
    </form>
  );
}

export default SignUpForm;
