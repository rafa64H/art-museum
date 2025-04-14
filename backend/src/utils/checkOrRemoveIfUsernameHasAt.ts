export default function checkOrRemoveIfUsernameHasAt(username: string) {
  const doesUsernameHasAt = username.startsWith("@");
  let usernameWithoutAt = username;
  if (doesUsernameHasAt) usernameWithoutAt = usernameWithoutAt.replace("@", "");
  return usernameWithoutAt;
}
