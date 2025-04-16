import { useActionState, useEffect, useRef } from "react";
import TextInput from "./ui/TextInput";
import { Link, useNavigate } from "react-router-dom";
import ButtonComponent from "./ui/ButtonComponent";
import setUserStoreLogin from "../utils/setUserStore";
import { createAccount } from "../utils/fetchFunctions";
import AlertParagraph from "./ui/AlertParagraph";
import { ResponseUserDataType } from "../types/userDataResponse";

function SignUpForm() {
  const [returnData, signUpAction, isPending] = useActionState(
    createAccount,
    null
  );

  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (returnData && typeof returnData === "object" && "error" in returnData) {
      if (returnData.error.includes("email"))
        emailRef.current?.setAttribute("data-error-input", "true");
      if (returnData.error.includes("username"))
        usernameRef.current?.setAttribute("data-error-input", "true");
      if (returnData.error.includes("name"))
        nameRef.current?.setAttribute("data-error-input", "true");
      if (returnData.error.includes("password"))
        passwordRef.current?.setAttribute("data-error-input", "true");
      if (returnData.error.includes("confirm password"))
        confirmPasswordRef.current?.setAttribute("data-error-input", "true");
    }

    if (returnData && "data" in returnData) {
      const returnDataAssertion = returnData as { data: ResponseUserDataType };
      const responseDataCreateAccount = returnDataAssertion.data;

      setUserStoreLogin(responseDataCreateAccount);
      navigate("/");
    }
  }, [returnData]);

  return (
    <form className="p-4" action={signUpAction}>
      <AlertParagraph
        conditionError={returnData && "error" in returnData ? true : false}
        textValue={returnData && "error" in returnData ? returnData.error : ""}
      ></AlertParagraph>

      <TextInput
        idForAndName="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        defaultValueProp={
          returnData &&
          typeof returnData === "object" &&
          "previousData" in returnData &&
          returnData.previousData.email
            ? returnData.previousData.email.toString()
            : ""
        }
        refProp={emailRef}
      ></TextInput>
      <TextInput
        idForAndName="username"
        label="Username"
        type="text"
        placeholder="Enter your username"
        defaultValueProp={
          returnData &&
          typeof returnData === "object" &&
          "previousData" in returnData &&
          returnData.previousData.username
            ? returnData.previousData.username.toString()
            : ""
        }
        refProp={usernameRef}
      ></TextInput>
      <TextInput
        idForAndName="name"
        label="Name"
        type="text"
        placeholder="Enter your name"
        defaultValueProp={
          returnData &&
          typeof returnData === "object" &&
          "previousData" in returnData &&
          returnData.previousData.name
            ? returnData.previousData.name.toString()
            : ""
        }
        refProp={nameRef}
      ></TextInput>
      <TextInput
        idForAndName="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        defaultValueProp={
          returnData &&
          typeof returnData === "object" &&
          "previousData" in returnData &&
          returnData.previousData.password
            ? returnData.previousData.password.toString()
            : ""
        }
        refProp={passwordRef}
      ></TextInput>
      <TextInput
        idForAndName="confirmPassword"
        label="Confirm password"
        type="password"
        placeholder="Repeat your password"
        defaultValueProp={
          returnData &&
          typeof returnData === "object" &&
          "previousData" in returnData &&
          returnData.previousData.confirmPassword
            ? returnData.previousData.confirmPassword.toString()
            : ""
        }
        refProp={confirmPasswordRef}
      ></TextInput>

      <ButtonComponent
        textBtn="Sign up"
        typeButton="submit"
        loadingDisabled={isPending}
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
