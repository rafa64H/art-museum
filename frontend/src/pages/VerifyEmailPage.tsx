import React, { useRef, useState } from "react";
import Header from "../components/Header";
import { Link, useParams } from "react-router-dom";
import TextInput from "../components/ui/TextInput";
import ButtonComponent from "../components/ui/ButtonComponent";
import { BACKEND_URL } from "../constants";

function VerifyEmailPage() {
  const params = useParams();
  const userIdParam = params.userId;
  const [submitFormLoading, setSubmitFormLoading] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(false);

  const codeRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Header></Header>
      <section
        className={`${
          verifiedEmail ? "block" : "hidden"
        } bg-mainBg py-4 text-white px-2`}
      >
        <h1 className="text-xl font-semibold">The email has been verified</h1>
        <Link to={"/account-settings"}>Go to account settings page</Link>
      </section>
      <div
        className={`${
          verifiedEmail ? "hidden" : "block"
        } bg-mainBg text-white py-4 px-2`}
      >
        <form
          onSubmit={async (e) => {
            try {
              e.preventDefault();
              setSubmitFormLoading(true);

              const url = `${BACKEND_URL}/auth/verify-email`;

              const responseVerifyEmail = await fetch(url, {
                method: "POST",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: userIdParam,
                  code: codeRef.current!.value,
                }),
              });

              if (responseVerifyEmail.ok) {
                setVerifiedEmail(true);
                setSubmitFormLoading(false);
                return;
              }
              console.log(responseVerifyEmail);
              console.log(await responseVerifyEmail.json());
              setSubmitFormLoading(false);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <div className="text-xl font-semibold">
            <TextInput
              idFor="code"
              label="Introduce email verification code"
              placeholder="Introduce code"
              refProp={codeRef}
              type="text"
              maxLengthProp={7}
            ></TextInput>
          </div>

          <ButtonComponent
            textBtn="Submit code"
            loadingDisabled={submitFormLoading}
            typeButton="submit"
          ></ButtonComponent>
        </form>
      </div>
    </>
  );
}

export default VerifyEmailPage;
