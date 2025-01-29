type Props = {
  onClickFunction?: () => void;
};
function ReplyBtn({ onClickFunction }: Props) {
  return (
    <button
      onClick={() => {
        if (onClickFunction) onClickFunction();
      }}
      className="transition-all duration-150 hover:text-firstGreen font-semibold"
    >
      Reply
      <i className="mx-2 fa-solid fa-reply"></i>
    </button>
  );
}

export default ReplyBtn;
