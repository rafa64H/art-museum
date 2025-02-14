import { useRef, useState } from "react";
import Header from "../components/Header";
import { Link, useParams } from "react-router-dom";
import TextInput from "../components/ui/TextInput";
import ButtonComponent from "../components/ui/ButtonComponent";
import { BACKEND_URL } from "../constants";
import { useDispatch } from "react-redux";
import { setEmailVerified } from "../services/redux-toolkit/auth/authSlice";
import { verifyEmail } from "../utils/fetchFunctions";
import { isAxiosError } from "axios";

function VerifyEmailPage() {
  const params = useParams();
  const userIdParam = params.userId;
  const [submitFormLoading, setSubmitFormLoading] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const codeRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  return (
    <>
      <Header></Header>
      <section
        className={`${
          verifiedEmail ? "block" : "hidden"
        } bg-mainBg py-4 text-white px-2`}
      >
        <h1 className="text-2xl font-semibold">The email has been verified</h1>
        <Link
          className="text-xl hover:underline hover:text-firstGreen"
          to={"/account-settings"}
        >
          Go to account settings page
        </Link>
      </section>
      <div
        className={`${
          verifiedEmail ? "hidden" : "block"
        } bg-mainBg text-white py-4 px-2`}
      >
        <p>{alertMessage}</p>
        <form
          onSubmit={async (e) => {
            try {
              e.preventDefault();
              setSubmitFormLoading(true);

              const responseVerifyEmail = await verifyEmail({
                userId: userIdParam,
                codeToVerifyEmail: codeRef.current?.value,
              });

              setVerifiedEmail(true);
              setSubmitFormLoading(false);

              dispatch(setEmailVerified(true));
              return;
            } catch (error) {
              if (isAxiosError(error)) {
                if (error.response) {
                  if (error.response.status === 400) {
                    setAlertMessage(error.response.data.message);
                    setSubmitFormLoading(false);
                    return;
                  }
                  setAlertMessage("Internal server error, try again later");
                  setSubmitFormLoading(false);
                  return;
                }
              }
              setSubmitFormLoading(false);
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
