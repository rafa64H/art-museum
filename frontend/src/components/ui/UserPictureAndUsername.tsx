import { useSelector } from "react-redux";
import { RootState } from "../../services/redux-toolkit/store";
type Props = {
  userId: string;
};

function UserPictureAndUsername({ userId }: Props) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex items-center" data-user-id={userId}>
      <img
        className="w-[min(7rem,7%)] h-[min(7rem,7%)] rounded-full"
        src={user.userData?.profilePictureURL}
      ></img>
      <p className="ml-2">{user.userData?.username}</p>
    </div>
  );
}

export default UserPictureAndUsername;
