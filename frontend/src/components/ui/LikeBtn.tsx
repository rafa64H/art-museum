import { useSelector } from "react-redux";
import { RootState } from "../../services/redux-toolkit/store";

type Props = {
  smallOrLarge: "small" | "large";
  onClickFunction?: React.MouseEventHandler<HTMLButtonElement>;
  arrayLiked: string[];
  loadingDisabled?: boolean;
};
function LikeBtn({
  smallOrLarge,
  onClickFunction,
  arrayLiked,
  loadingDisabled,
}: Props) {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <button
      className={`${smallOrLarge === "large" ? "p-2 px-2" : "p-1 px-1"} ${
        user.userData && arrayLiked && arrayLiked.includes(user.userData._id)
          ? "bg-firstDarkBlue text-firstGreen"
          : "bg-firstBrown text-white"
      } p-2 transition-all duration-150 hover:bg-firstGreen hover:text-white font-semibold`}
      onClick={async (e) => {
        if (onClickFunction) onClickFunction(e);
      }}
      disabled={loadingDisabled}
    >
      Like
      <i className=" mx-2 fa-solid fa-thumbs-up"></i>
      {arrayLiked ? arrayLiked.length : "0"}
    </button>
  );
}

export default LikeBtn;
