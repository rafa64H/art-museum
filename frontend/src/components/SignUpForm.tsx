import React, { useRef, useState } from "react";
import TextInput from "./ui/TextInput";
import { Link, useNavigate } from "react-router-dom";
import ButtonComponent from "./ui/ButtonComponent";
import { BACKEND_URL } from "../constants";
import { setUser } from "../services/redux-toolkit/auth/authSlice";
import { useDispatch } from "react-redux";
import checkEmptyFieldsForm from "../utils/forms/checkEmptyFieldsForm";
import checkPasswordsMatch from "../utils/forms/checkPasswordsMatch";

function SignUpForm() {
  const [alertMessage, setAlertMessage] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  return (
    <form
      className="p-4"
      onSubmit={async (e) => {
        e.preventDefault();
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

          //Regex: does it have 6 characters, a symbol and a number?
          const regexPassword = /^(?=.*[0-9])(?=.*[\W_])[\w\W]{6,}$/;

          //Regex: does it have 3 non-space characters
          //and does not only consist of spaces?
          const regexNameAndUsername = /^(?=.*\S.*\S.*\S)(?!\s*$).*/;

          if (!checkEmptyFieldsForm(allRefsCurrent, setAlertMessage)) {
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
            return;
          }

          if (!regexPassword.test(password!)) {
            passwordRef.current!.setAttribute("data-error-input", "true");

            setAlertMessage(
              "Password is not valid: Needs 6 characters, at least symbol and at least a number"
            );
            return;
          }
          if (!regexNameAndUsername.test(username!)) {
            usernameRef.current!.setAttribute("data-error-input", "true");

            setAlertMessage("Invalid username, needs at least 3 characters");
            return;
          }
          if (!regexNameAndUsername.test(name!)) {
            nameRef.current!.setAttribute("data-error-input", "true");

            setAlertMessage("Invalid Name, needs at least 3 characters");
            return;
          }

          const url = `${BACKEND_URL}/auth/signup`;
          const data = {
            email,
            username,
            name,
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

          if (response.status !== 201) {
            setAlertMessage("Internal server error, try again later");
          }
          if (response.status === 201) {
            const responseData = await response.json();
            console.log(responseData);

            const userData = {
              id: responseData.user._id as string,
              username: responseData.user.username as string,
              name: responseData.user.name as string,
              profilePictureURL: responseData.user.profilePictureURL as string,
              email: responseData.user.email as string,
              role: responseData.user.role as "user" | "admin",
              lastLogin: responseData.user.lastLogin as Date,
              verified: responseData.user.verified as boolean,
              accessToken: responseData.accessToken as string,
            };

            dispatch(setUser({ userData, isLoading: false }));
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

      <ButtonComponent textBtn="Sign up" typeButton="submit"></ButtonComponent>

      <p className="mt-4">
        <Link className="hover:underline" to="/login">
          Already have account? Click here
        </Link>
      </p>
    </form>
  );
}

export default SignUpForm;
