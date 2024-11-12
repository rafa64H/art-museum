import React from "react";

type props = {
  textBtn: string;
  additionalClassnames?: string;
  typeButton?: "submit" | "button" | "reset" | undefined;
  onClickFunction?: React.MouseEventHandler<HTMLButtonElement>;
};

function ButtonComponent({
  textBtn,
  additionalClassnames,
  typeButton,
  onClickFunction,
}: props) {
  return (
    <button
      type={`${typeButton ? typeButton : "button"}`}
      className={`bg-firstBrown hover:bg-firstGreen mt-2 p-3 font-semibold text-white duration-150 ${
        additionalClassnames ? `${additionalClassnames}` : ""
      }`}
      onClick={(e) => {
        if (onClickFunction) onClickFunction(e);
      }}
    >
      {textBtn}
    </button>
  );
}

export default ButtonComponent;
