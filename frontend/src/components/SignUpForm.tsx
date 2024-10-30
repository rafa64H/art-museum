import React, { useRef } from "react";
import TextInput from "./ui/TextInput";
import { Link, useNavigate } from "react-router-dom";
import ButtonComponent from "./ui/ButtonComponent";
import { BACKEND_URL } from "../constants";
import {
  setUser,
  UserReduxToolkit,
} from "../services/redux-toolkit/auth/authSlice";
import { useDispatch } from "react-redux";

function SignUpForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

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
          const url = `${BACKEND_URL}/auth/signup`;
          const data = {
            email,
            username,
            name,
            password,
          };
          console.log(data);
          console.log(emailRef);
          const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (response.status === 201) {
            const responseData = await response.json();

            const userData: UserReduxToolkit = {
              id: responseData._id as string,
              username: responseData.username as string,
              name: responseData.name as string,
              email: responseData.email as string,
              role: responseData.role as "user" | "admin",
              lastLogin: responseData.lastLogin as Date,
              verified: responseData.verified as boolean,
              accessToken: responseData.accessToken as string,
            };

            dispatch(setUser(userData));
            navigate("/");
          }
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <TextInput
        idFor="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        refProp={emailRef}
      ></TextInput>
      <TextInput
        idFor="username"
        label="Username"
        type="text"
        placeholder="Enter your username"
        refProp={usernameRef}
      ></TextInput>
      <TextInput
        idFor="name"
        label="Name"
        type="text"
        placeholder="Enter your name"
        refProp={nameRef}
      ></TextInput>
      <TextInput
        idFor="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        refProp={passwordRef}
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
