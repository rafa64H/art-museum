type Props = {
  smallOrLarge: "small" | "large";
};
function DislikeBtn({ smallOrLarge }: Props) {
  return (
    <button
      className={`${
        smallOrLarge === "large" ? "p-2 px-2" : "p-1 px-1"
      } bg-firstBrown transition-all duration-150 hover:bg-firstGreen font-semibold`}
    >
      Dislike
      <i className=" mx-2 fa-solid fa-thumbs-down"></i>0
    </button>
  );
}

export default DislikeBtn;
