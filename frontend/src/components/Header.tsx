import React from "react";
import NavBar from "./NavBar";
import CompanyLogo from "./ui/CompanyLogo";

function Header() {
  return (
    <header className="bg-FirstDarkBlue flex flex-col items-center p-4">
      <CompanyLogo></CompanyLogo>
      <NavBar isOpen={true}></NavBar>
    </header>
  );
}

export default Header;
