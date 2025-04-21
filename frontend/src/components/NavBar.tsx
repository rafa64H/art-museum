import NavItem from "./ui/NavItem";
import { useSelector } from "react-redux";
import { RootState } from "../services/redux-toolkit/store";
import { Link } from "react-router-dom";
type Props = {
  isOpen: boolean;
};
function NavBar({ isOpen }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <nav
      className={`bg-firstDarkBlue absolute right-0 top-[17.5%] h-full w-[min(80%,30rem)] origin-right text-xl font-semibold text-white duration-150 sm:top-[20%] sm:mt-0 ${
        isOpen ? "z-20 scale-x-100" : "scale-x-0"
      }`}
    >
      <ul className="flex list-none flex-col items-center gap-2">
        {user.isLoading ? (
          <>
            <p>Loading...</p>
          </>
        ) : user.userData ? (
          <>
            <NavItem linkProp="/" text="Home"></NavItem>
            <Link to={`/profile/${user.userData._id}`}>
              <img
                className="w-[7rem] h-[7rem] rounded-full hover:border-firstGreen duration-150 border-2 border-[rgba(0,0,0,0)]"
                src={`${user.userData.profilePictureURL}`}
              ></img>
            </Link>
          </>
        ) : (
          <>
            <NavItem linkProp="/login" text="Login"></NavItem>
            <NavItem linkProp="/sign-up" text="Sign up"></NavItem>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
