import React from "react";

type props = {
  textBtn: string;
  buttonActivated: boolean;
  typeButton?: "submit" | "button" | "reset" | undefined;
  onClickFunction?: React.MouseEventHandler<HTMLButtonElement>;
};

function MultipleSelectButton({
  textBtn,
  typeButton,
  buttonActivated,
  onClickFunction,
}: props) {
  return (
    <button
      data-button-activated={`${buttonActivated}`}
      type={`${typeButton ? typeButton : "button"}`}
      className={`bg-firstBrown lg:ml-4 block mx-auto w-[min(40%,40rem)] hover:bg-firstGreen data-[button-activated='true']:bg-firstGreen mt-2 p-3 font-semibold text-white duration-150`}
      onClick={(e) => {
        if (onClickFunction) onClickFunction(e);
      }}
    >
      {textBtn}
    </button>
  );
}

export default MultipleSelectButton;
