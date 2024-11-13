export default function checkValidityPassword(
  password: string,
  passwordRefCurrent: HTMLInputElement,
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>
): boolean {
  const regexPassword = /^(?=.*[0-9])(?=.*[\W_])[\w\W]{6,}$/;
  if (!regexPassword.test(password!)) {
    passwordRefCurrent.setAttribute("data-error-input", "true");

    setAlertMessage(
      "Password is not valid: Needs 6 characters, at least symbol and at least a number"
    );
    return false;
  }
  return true;
}
