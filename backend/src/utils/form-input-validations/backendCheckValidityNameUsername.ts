export default function backendCheckValidityNameOrUsername(
  nameOrUsername: string
) {
  const regexNameAndUsername = /(?=.*\S.*\S.*\S)/;

  if (!regexNameAndUsername.test(nameOrUsername)) {
    return false;
  }
  return true;
}
