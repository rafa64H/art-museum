import React, { useRef } from "react";
import TextInput from "./ui/TextInput";
import { Link } from "react-router-dom";
import ButtonComponent from "./ui/ButtonComponent";

function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="border-2 border-solid border-purple-500 p-2"
      onSubmit={(e) => {
        e.preventDefault();
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
        idFor="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        refProp={passwordRef}
      ></TextInput>

      <ButtonComponent textBtn="Login" typeButton="submit"></ButtonComponent>

      <p className="mt-4">
        <Link className="hover:underline" to="/sign-up">
          Don not have account? Click here to register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
