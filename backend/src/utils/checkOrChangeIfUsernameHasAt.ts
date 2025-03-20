export default function checkOrChangeIfUsernameHasAt(username: string) {
  const usernameWithoutSpaces = username.replace(/\s/g, "");
  let usernameWithAt = usernameWithoutSpaces;
  const doesUsernameHasAt = usernameWithoutSpaces.startsWith("@");
  if (!doesUsernameHasAt) usernameWithAt = `@${usernameWithoutSpaces}`;
  return usernameWithAt;
}
