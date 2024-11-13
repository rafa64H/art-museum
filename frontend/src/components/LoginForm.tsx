import { useRef, useState } from "react";
import TextInput from "./ui/TextInput";
import { Link, useNavigate } from "react-router-dom";
import ButtonComponent from "./ui/ButtonComponent";
import { BACKEND_URL } from "../constants";
import checkEmptyFieldsForm from "../utils/forms/checkEmptyFieldsForm";
import setUserStoreLogin from "../utils/setUserStoreLogin";

function SignUpForm() {
  const [alertMessage, setAlertMessage] = useState("");

  const emailOrUsernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  return (
    <form
      className="p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const emailOrUsername = emailOrUsernameRef.current?.value;
          const password = passwordRef.current?.value;

          const allRefsCurrent = [
            emailOrUsernameRef.current!,
            passwordRef.current!,
          ];

          if (!checkEmptyFieldsForm(allRefsCurrent, setAlertMessage)) {
            return;
          }

          const url = `${BACKEND_URL}/auth/login`;
          const data = {
            emailOrUsername,
            password,
          };
          const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (response.status !== 200 && !(response.status === 400)) {
            setAlertMessage("Internal server error, try again later");
            return;
          }
          if (response.status === 400) {
            setAlertMessage("Invalid email/username or password");
            emailOrUsernameRef.current!.setAttribute(
              "data-error-input",
              "true"
            );
            passwordRef.current!.setAttribute("data-error-input", "true");
            return;
          }
          if (response.status === 200) {
            const responseData = await response.json();

            setUserStoreLogin(responseData);
            navigate("/");
          }
        } catch (error) {
          setAlertMessage("Internal server error, try again later");

          console.error(error);
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
        idFor="emailOrUsername"
        label="Email or username"
        type="text"
        placeholder="Enter your email or username"
        refProp={emailOrUsernameRef}
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

      <ButtonComponent textBtn="Login" typeButton="submit"></ButtonComponent>

      <p className="mt-4">
        <Link className="hover:underline" to="/sign-up">
          Do not have account? Click here to register
        </Link>
      </p>
    </form>
  );
}

export default SignUpForm;
