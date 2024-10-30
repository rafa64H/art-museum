import { BACKEND_URL } from "../constants";

export default async function requestAccessTokenRefresh() {
  const url = `${BACKEND_URL}/auth/refresh`;

  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
