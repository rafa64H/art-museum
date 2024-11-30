import React from "react";

type props = {
  textBtn: string;
  additionalClassnames?: string;
  typeButton?: "submit" | "button" | "reset" | undefined;
  loadingDisabled?: boolean;
  onClickFunction?: React.MouseEventHandler<HTMLButtonElement>;
};

function ButtonComponent({
  textBtn,
  additionalClassnames,
  typeButton,
  loadingDisabled,
  onClickFunction,
}: props) {
  return (
    <button
      type={`${typeButton ? typeButton : "button"}`}
      className={`bg-firstBrown hover:bg-firstGreen mt-2 p-3 font-semibold text-white duration-150 disabled:bg-gray-500 ${
        additionalClassnames ? `${additionalClassnames}` : ""
      }`}
      onClick={async (e) => {
        if (onClickFunction) onClickFunction(e);
      }}
      disabled={loadingDisabled}
    >
      {textBtn}
    </button>
  );
}

export default ButtonComponent;
