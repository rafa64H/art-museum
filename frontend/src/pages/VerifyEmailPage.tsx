import { startTransition, useActionState, useEffect } from "react";
import Header from "../components/Header";
import { Link, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { verifyEmail } from "../utils/fetchFunctions";
import { useDispatch } from "react-redux";
import { setEmailVerified } from "../services/redux-toolkit/auth/authSlice";

function VerifyEmailPage() {
  const params = useParams();
  const userIdParam = params.userId;
  const verifyEmailCode = params.code;
  const dispatch = useDispatch();
  const [state, verifyEmailAction, isPending] = useActionState(async () => {
    try {
      await verifyEmail(userIdParam, verifyEmailCode);
      dispatch(setEmailVerified(true));
      return { success: "Your email has been verified" };
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status === 400)
          return { error: "Error: The link is invalid" };
        return { error: "Unexpected error, try again later" };
      }
    }
  }, null);

  useEffect(() => {
    startTransition(verifyEmailAction);
  }, []);

  return (
    <>
      <Header></Header>

      <section className="text-white bg-firstLavender text-center py-40 px-20">
        <h1 className="font-bold text-4xl">
          {!state || isPending
            ? "Loading..."
            : state && "error" in state
            ? `${state.error}`
            : state.success}
        </h1>

        <p className="text-2xl mt-8">
          <Link className="hover:underline" to={"/account-settings"}>
            Go to account settings <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </p>
      </section>
    </>
  );
}

export default VerifyEmailPage;
