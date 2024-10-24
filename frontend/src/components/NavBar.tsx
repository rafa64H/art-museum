import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <ul className="flex gap-4 list-none">
        <li>
          <Link to={"/login"}>Login</Link>
        </li>
        <li>
          <Link to={"/sign-up"}>Sign up</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
