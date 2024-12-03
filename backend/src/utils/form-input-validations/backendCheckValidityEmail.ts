export default function backendCheckValidityEmail(email: string) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regexEmail.test(email)) {
    return false;
  }
  return true;
}
