import { useActionState, useEffect, useRef } from "react";
import TextInput from "./ui/TextInput";
import { Link, useNavigate } from "react-router-dom";
import ButtonComponent from "./ui/ButtonComponent";
import setUserStoreLogin from "../utils/setUserStore";
import { loginToAccount } from "../utils/fetchFunctions";
import AlertParagraph from "./ui/AlertParagraph";
import { ResponseUserDataType } from "../types/userDataResponse";

function SignUpForm() {
  const [returnData, loginAction, isPending] = useActionState(
    loginToAccount,
    null
  );

  const emailOrUsernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  useEffect(() => {
    if (returnData && typeof returnData === "object" && "error" in returnData) {
      if (returnData.error.includes("emailOrUsername"))
        emailOrUsernameRef.current?.setAttribute("data-error-input", "true");
      if (returnData.error.includes("password"))
        passwordRef.current?.setAttribute("data-error-input", "true");
    }

    if (returnData && typeof returnData === "object" && "data" in returnData) {
      const returnDataAssertion = returnData as { data: ResponseUserDataType };
      const responseDataLoginAccount = returnDataAssertion.data;

      setUserStoreLogin(responseDataLoginAccount);
      navigate("/");
    }
  }, [returnData]);

  return (
    <form className="p-4" action={loginAction}>
      <AlertParagraph
        conditionError={returnData && "error" in returnData ? true : false}
        textValue={returnData && "error" in returnData ? returnData.error : ""}
      ></AlertParagraph>

      <TextInput
        idForAndName="emailOrUsername"
        label="Email or username"
        type="text"
        placeholder="Enter your email or username"
        defaultValueProp={
          returnData &&
          typeof returnData === "object" &&
          "previousData" in returnData &&
          returnData.previousData.emailOrUsername
            ? returnData.previousData.emailOrUsername.toString()
            : ""
        }
        refProp={emailOrUsernameRef}
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

      <ButtonComponent
        textBtn="Login"
        typeButton="submit"
        loadingDisabled={isPending}
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
