type Props = {
  smallOrLarge: "small" | "large";
};
function LikeBtn({ smallOrLarge }: Props) {
  return (
    <button
      className={`${
        smallOrLarge === "large" ? "p-2 px-2" : "p-1 px-1"
      }p-2 bg-FirstDarkBlue text-firstGreen transition-all duration-150 hover:bg-firstGreen hover:text-white font-semibold`}
    >
      Like
      <i className=" mx-2 fa-solid fa-thumbs-up"></i>1
    </button>
  );
}

export default LikeBtn;
