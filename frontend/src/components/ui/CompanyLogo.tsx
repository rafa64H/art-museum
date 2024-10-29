import React from "react";
import { Link } from "react-router-dom";
type Props = {
  additionalClasses?: string;
};
function CompanyLogo({ additionalClasses }: Props) {
  return (
    <Link
      className={`inline-block w-[min(30%,10rem)] ${additionalClasses ? additionalClasses : ""}`}
      to={"/"}
    >
      <img src="/company-logo.png"></img>
    </Link>
  );
}

export default CompanyLogo;
