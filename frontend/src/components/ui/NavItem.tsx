import React from "react";
import { Link } from "react-router-dom";
type Props = {
  linkProp: string;
  text: string;
};
function NavItem({ linkProp, text }: Props) {
  return (
    <li>
      <Link
        className="relative inline-block py-2 after:absolute after:bottom-0 after:left-0 after:block after:w-full after:scale-x-0 after:bg-white after:py-[0.08em] after:transition-all  after:duration-200 after:content-[''] hover:after:scale-x-100"
        to={`${linkProp}`}
      >
        {text}
      </Link>
    </li>
  );
}

export default NavItem;
