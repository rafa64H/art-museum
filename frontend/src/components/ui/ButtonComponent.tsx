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
      <div className={loadingDisabled ? "opacity-0" : "opacity-1"}>
        {textBtn}
      </div>
      <div className={loadingDisabled ? "block" : "hidden"}>
        <div className="inline-block w-[1.5rem] h-[1.5rem] rounded-full border-black border-t-transparent border-4 animate-loadingAnimation"></div>
      </div>
    </button>
  );
}

export default ButtonComponent;
