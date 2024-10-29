import React, { useRef } from "react";
import TextInput from "./ui/TextInput";
import { Link } from "react-router-dom";

function SignUpForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  console.log(import.meta.env.VITE_BACKEND_URL);

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

          const url = `${import.meta.env.VITE_BACKEND_URL}/auth/signup`;
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
          console.log(await response);
          console.log(await response.json());
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

      <button
        type="submit"
        className="bg-firstBrown hover:bg-firstGreen mt-2 p-3 font-semibold text-white duration-150"
      >
        Sign up
      </button>

      <p className="mt-4">
        <Link className="hover:underline" to="/login">
          Already have account? Click here
        </Link>
      </p>
    </form>
  );
}

export default SignUpForm;
