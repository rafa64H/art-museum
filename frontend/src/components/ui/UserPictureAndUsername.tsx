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
        className="w-14 h-14 rounded-full"
        src={user.userData?.profilePictureURL}
      ></img>
      <p className="ml-2">{user.userData?.username}</p>
    </div>
  );
}

export default UserPictureAndUsername;
