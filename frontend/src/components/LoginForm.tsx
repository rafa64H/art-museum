import React, { useRef } from "react";
import TextInput from "./ui/TextInput";

function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="p-2 border-2 border-solid border-purple-500"
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

      <button type="submit" className="bg-green-700 p-3 text-white">
        Login
      </button>
    </form>
  );
}

export default LoginForm;
