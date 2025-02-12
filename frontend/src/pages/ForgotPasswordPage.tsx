import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import TextInput from "../components/ui/TextInput";
import ButtonComponent from "../components/ui/ButtonComponent";
import checkEmptyFieldsForm from "../utils/forms/checkEmptyFieldsForm";
import checkPasswordsMatch from "../utils/forms/checkPasswordsMatch";
import checkValidityPassword from "../utils/forms/checkValidityPassword";
import { Link } from "react-router-dom";
import { forgotPasswordFetch, resetPassword } from "../utils/fetchFunctions";

function ForgotPasswordPage() {
  const [alertMessage, setAlertMessage] = useState("");
  const [submitFormLoading, setSubmitFormLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [changedPasswordSuccess, setChangedPasswordSuccess] = useState(false);

  const emailOrUsernameRef = useRef<HTMLInputElement>(null);

  const resetPasswordTokenRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmNewPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(emailOrUsernameRef.current?.value);
  }, [emailSent]);

  return (
    <>
      <Header></Header>
      <section
        className={`${
          emailSent && !changedPasswordSuccess ? "block" : "hidden"
        } bg-mainBg py-4 text-white px-2`}
      >
        <h1 className="text-2xl mb-4 font-semibold">Email sent successfully</h1>
        <form
          onSubmit={async (e) => {
            try {
              e.preventDefault();
              setSubmitFormLoading(true);

              const allRefsCurrent = [
                resetPasswordTokenRef.current!,
                newPasswordRef.current!,
                confirmNewPasswordRef.current!,
              ];

              if (!checkEmptyFieldsForm(allRefsCurrent, setAlertMessage)) {
                setSubmitFormLoading(false);
                return;
              }

              if (
                !checkPasswordsMatch(
                  newPasswordRef.current!.value,
                  confirmNewPasswordRef.current!.value,
                  newPasswordRef.current!,
                  confirmNewPasswordRef.current!,
                  setAlertMessage
                )
              ) {
                setSubmitFormLoading(false);
                return;
              }

              if (
                !checkValidityPassword(
                  newPasswordRef.current!.value,
                  newPasswordRef.current!,
                  setAlertMessage
                )
              ) {
                setSubmitFormLoading(false);
                setAlertMessage("Password changed successfully");
                return;
              }

              const responseResetPassword = await resetPassword({
                password: newPasswordRef.current?.value,
                token: resetPasswordTokenRef.current?.value,
                emailOrUsername: emailOrUsernameRef.current?.value,
              });

              if (responseResetPassword.ok) {
                setSubmitFormLoading(false);
                setChangedPasswordSuccess(true);

                return;
              }

              setSubmitFormLoading(false);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <div className="text-xl font-semibold">
            <TextInput
              idFor="resetPasswordToken"
              label="Introduce the code we sent to your email address"
              placeholder="Introduce code"
              refProp={resetPasswordTokenRef}
              type="text"
            ></TextInput>

            <TextInput
              idFor="newPassword"
              label="Introduce your new password"
              placeholder="Introduce new password"
              refProp={newPasswordRef}
              type="password"
            ></TextInput>

            <TextInput
              idFor="confirmNewPassword"
              label="Confirm your new password"
              placeholder="Confirm your new password"
              refProp={confirmNewPasswordRef}
              type="password"
            ></TextInput>
          </div>

          <ButtonComponent
            textBtn="Submit code"
            loadingDisabled={submitFormLoading}
            typeButton="submit"
          ></ButtonComponent>
        </form>
      </section>
      <section
        className={`${
          changedPasswordSuccess ? "block" : "hidden"
        } bg-mainBg py-4 text-white px-2`}
      >
        <h1 className="text-2xl mb-4 font-semibold">
          Password changed successfully
        </h1>
        <Link
          className="text-xl hover:underline hover:text-firstGreen"
          to={"/login"}
        >
          Go to login page
        </Link>
      </section>
      <div
        className={`${
          emailSent ? "hidden" : "block"
        } bg-mainBg text-white py-4 px-2`}
      >
        <p className="text-lg text-red-700 font-semibold">{alertMessage}</p>
        <form
          onSubmit={async (e) => {
            try {
              e.preventDefault();
              setSubmitFormLoading(true);

              const responseForgotPassword = await forgotPasswordFetch({
                emailOrUsername: emailOrUsernameRef.current?.value,
              });

              if (responseForgotPassword.ok) {
                setEmailSent(true);
                setSubmitFormLoading(false);

                return;
              }

              setSubmitFormLoading(false);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <div className="text-xl font-semibold">
            <TextInput
              idFor="emailOrUsername"
              label="Introduce your account email or username"
              placeholder="Introduce email or username"
              refProp={emailOrUsernameRef}
              type="text"
            ></TextInput>
          </div>

          <ButtonComponent
            textBtn="Send email"
            loadingDisabled={submitFormLoading}
            typeButton="submit"
          ></ButtonComponent>
        </form>
      </div>
    </>
  );
}

export default ForgotPasswordPage;
