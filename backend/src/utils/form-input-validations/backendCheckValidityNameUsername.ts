export default function backendCheckValidityNameOrUsername(
  nameOrUsername: string
) {
  const regexNameAndUsername = /^(?=.*\S.*\S.*\S)(?!\s*$).*/;

  if (!regexNameAndUsername.test(nameOrUsername)) {
    return false;
  }
  return true;
}
