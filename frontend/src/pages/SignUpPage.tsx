import React from "react";
import Header from "../components/Header";
import SignUpForm from "../components/SignUpForm";

function SignUpPage() {
  return (
    <>
      <Header></Header>
      <div className="bg-mainBg text-white">
        <SignUpForm></SignUpForm>
      </div>
    </>
  );
}

export default SignUpPage;
