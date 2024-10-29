import React from "react";
import { Link } from "react-router-dom";

function CompanyLogo() {
  return (
    <Link className="inline-block w-[min(30%,10rem)]" to={"/"}>
      <img src="/company-logo.png"></img>
    </Link>
  );
}

export default CompanyLogo;
