export default function backendCheckValidityPasswordBackend(
  password: string
): boolean {
  const regexPassword = /^(?=.*[0-9])(?=.*[\W_])[\w\W]{6,}$/;
  if (!regexPassword.test(password)) {
    return false;
  }
  return true;
}
