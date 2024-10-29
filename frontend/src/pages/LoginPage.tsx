import React from "react";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <>
      <Header></Header>
      <div className="bg-mainBg text-white">
        <LoginForm></LoginForm>
      </div>
    </>
  );
}

export default LoginPage;
