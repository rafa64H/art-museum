export default function createEmailToken() {
  const verificationToken = Math.floor(
    1000000 + Math.random() * 9000000
  ).toString();

  return verificationToken;
}
