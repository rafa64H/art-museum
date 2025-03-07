export default function backendCheckValidityPasswordBackend(
  password: string
): boolean {
  const regexPassword = /(?=.*[a-zA-Z])(?=.*\d)(?=.*[^\w\s])/;
  if (!regexPassword.test(password)) {
    return false;
  }
  return true;
}
