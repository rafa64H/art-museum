import React from "react";
import NavItem from "./ui/NavItem";
type Props = {
  isOpen: boolean;
};
function NavBar({ isOpen }: Props) {
  return (
    <nav
      className={`bg-FirstDarkBlue absolute right-0 mt-[17%] h-full w-[min(80%,30rem)] origin-right text-xl font-semibold text-white duration-150 sm:top-[26%] sm:mt-0 ${
        isOpen ? "scale-x-100" : "scale-x-0"
      }`}
    >
      <ul className="flex list-none flex-col items-center gap-2">
        <NavItem linkProp="/login" text="Login"></NavItem>
        <NavItem linkProp="/sign-up" text="Sign up"></NavItem>
      </ul>
    </nav>
  );
}

export default NavBar;
