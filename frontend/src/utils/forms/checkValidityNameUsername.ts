export default function checkValidityNameOrUsername(
  nameOrUsername: string,
  nameOrUsernameRefCurrent: HTMLInputElement,
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>
) {
  const regexNameAndUsername = /^(?=.*\S.*\S.*\S)(?!\s*$).*/;

  if (!regexNameAndUsername.test(nameOrUsername!)) {
    nameOrUsernameRefCurrent.setAttribute("data-error-input", "true");

    setAlertMessage("Invalid username, needs at least 3 characters");
    return false;
  }
  return true;
}
