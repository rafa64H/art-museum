import { startTransition, useActionState, useEffect } from "react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isAxiosError } from "axios";
import { verifyEmail } from "../utils/fetchFunctions";

function VerifyEmailPage() {
  const params = useParams();
  const userIdParam = params.userId;
  const verifyEmailCode = params.code;
  const [state, verifyEmailAction, isPending] = useActionState(async () => {
    try {
      await verifyEmail(userIdParam, verifyEmailCode);
      return { success: "Verified email" };
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.status, error.message);
        return { error: "Error" };
      }
    }
  }, null);

  useEffect(() => {
    startTransition(verifyEmailAction);
  }, []);

  return (
    <>
      <Header></Header>

      <h1 className="text-bold text-4xl text-red-400">
        {!state || isPending
          ? "Loading..."
          : state && "error" in state
          ? state.error
          : state.success}
      </h1>
    </>
  );
}

export default VerifyEmailPage;
