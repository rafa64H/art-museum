import React, { useState } from "react";
import NavBar from "./NavBar";
import CompanyLogo from "./ui/CompanyLogo";

function Header() {
  const [openNav, setOpenNav] = useState(true);

  return (
    <header className="bg-FirstDarkBlue flex items-center justify-between p-4">
      <CompanyLogo additionalClasses="z-30"></CompanyLogo>
      <button
        onClick={() => {
          setOpenNav((prevValue) => !prevValue);
        }}
        className="text-4xl text-white"
      >
        <i className={`fa-solid ${openNav ? "fa-xmark" : "fa-bars"}`}></i>
      </button>
      <NavBar isOpen={openNav}></NavBar>
    </header>
  );
}

export default Header;
