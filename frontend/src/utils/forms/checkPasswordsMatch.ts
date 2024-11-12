export default function checkPasswordsMatch(
  password: string,
  confirmPassword: string,
  passwordRefCurrent: HTMLInputElement,
  confirmPasswordRefCurrent: HTMLInputElement,
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>
): boolean {
  if (password !== confirmPassword) {
    passwordRefCurrent.setAttribute("data-error-input", "true");
    confirmPasswordRefCurrent.setAttribute("data-error-input", "true");
    setAlertMessage("Passwords do not match");
    return false;
  }
  return true;
}
