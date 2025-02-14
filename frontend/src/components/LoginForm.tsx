import { useRef, useState } from "react";
import TextInput from "./ui/TextInput";
import { Link, useNavigate } from "react-router-dom";
import ButtonComponent from "./ui/ButtonComponent";
import checkEmptyFieldsForm from "../utils/forms/checkEmptyFieldsForm";
import setUserStoreLogin from "../utils/setUserStore";
import { loginToAccount } from "../utils/fetchFunctions";
import { isAxiosError } from "axios";

function SignUpForm() {
  const [alertMessage, setAlertMessage] = useState("");
  const [submitFormLoading, setSubmitFormLoading] = useState(false);

  const emailOrUsernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  return (
    <form
      className="p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitFormLoading(true);
        try {
          const emailOrUsername = emailOrUsernameRef.current?.value;
          const password = passwordRef.current?.value;

          const allRefsCurrent = [
            emailOrUsernameRef.current!,
            passwordRef.current!,
          ];

          if (!checkEmptyFieldsForm(allRefsCurrent, setAlertMessage)) {
            setSubmitFormLoading(false);
            return;
          }

          const data = {
            emailOrUsername,
            password,
          };
          const responseFromLogin = await loginToAccount(data);

          const responseDataFromLogin = await responseFromLogin.data;

          setUserStoreLogin(responseDataFromLogin);
          navigate("/");
        } catch (error) {
          if (isAxiosError(error)) {
            if (error.response) {
              if (error.response.status === 400) {
                setAlertMessage("Invalid email/username or password");
                emailOrUsernameRef.current!.setAttribute(
                  "data-error-input",
                  "true"
                );
                passwordRef.current!.setAttribute("data-error-input", "true");
                setSubmitFormLoading(false);
                return;
              }
            }
          }

          setAlertMessage("Internal server error, try again later");

          setSubmitFormLoading(false);
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

      <ButtonComponent
        textBtn="Login"
        typeButton="submit"
        loadingDisabled={submitFormLoading}
      ></ButtonComponent>

      <p className="mt-4">
        <Link className="hover:underline" to="/forgot-password">
          Forgot password? Click here
        </Link>
      </p>
      <p className="mt-4">
        <Link className="hover:underline" to="/sign-up">
          Do not have account? Click here to register
        </Link>
      </p>
    </form>
  );
}

export default SignUpForm;
