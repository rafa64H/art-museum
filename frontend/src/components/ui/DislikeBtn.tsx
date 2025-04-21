import { useSelector } from "react-redux";
import { RootState } from "../../services/redux-toolkit/store";

type Props = {
  smallOrLarge: "small" | "large";
  arrayDisliked: string[];
  onClickFunction?: React.MouseEventHandler<HTMLButtonElement>;
  loadingDisabled?: boolean;
};
function DislikeBtn({
  smallOrLarge,
  onClickFunction,
  arrayDisliked,
  loadingDisabled,
}: Props) {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <button
      className={`${smallOrLarge === "large" ? "p-2 px-2" : "p-1 px-1"} ${
        user.userData &&
        arrayDisliked &&
        arrayDisliked.includes(user.userData._id)
          ? "bg-firstDarkBlue text-firstGreen"
          : "bg-firstBrown text-white"
      } bg-firstBrown transition-all duration-150 hover:bg-firstGreen font-semibold`}
      onClick={async (e) => {
        if (onClickFunction) onClickFunction(e);
      }}
      disabled={loadingDisabled}
    >
      Dislike
      <i className=" mx-2 fa-solid fa-thumbs-down"></i>
      {arrayDisliked ? arrayDisliked.length : "0"}
    </button>
  );
}

export default DislikeBtn;
