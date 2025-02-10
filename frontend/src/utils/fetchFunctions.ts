//You should handle the try catch on where you're calling these functoins.

import { BACKEND_URL } from "../constants";
import { store } from "../services/redux-toolkit/store";

const user = store.getState().auth.user;
export async function getSinglePost(postId: string | undefined) {
  const urlGetSinglePost = `${BACKEND_URL}/api/posts/${postId}`;

  const responseGetSinglePost = await fetch(urlGetSinglePost, {
    method: "GET",
  });
  return responseGetSinglePost;
}

export async function getCommentsFromPost(postId: string | undefined) {
  const urlGetComments = `${BACKEND_URL}/api/posts/${postId}/comments`;
  const responseGetComments = await fetch(urlGetComments, {
    method: "GET",
  });

  return responseGetComments;
}

export async function createComment(
  postId: string | undefined,
  content: string
) {
  const urlToCreateComment = `${BACKEND_URL}/api/posts/${postId}/comments`;
  const responseCreateComment = await fetch(urlToCreateComment, {
    headers: {
      authorization: "Bearer " + user.userData?.accessToken,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      content: content,
    }),
  });

  return responseCreateComment;
}

export async function addFollow(userProfileId: string | undefined) {
  const urlToAddFollow = `${BACKEND_URL}/api/users/followers/${userProfileId}`;

  const responseAddFollow = await fetch(urlToAddFollow, {
    method: "POST",
    headers: {
      authorization: `Bearer ${user.userData?.accessToken}`,
    },
  });

  return responseAddFollow;
}

export async function deleteFollow(userProfileId: string | undefined) {
  const urlToDeleteFollow = `${BACKEND_URL}/api/users/followers/${userProfileId}`;

  const responseDeleteFollow = await fetch(urlToDeleteFollow, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${user.userData?.accessToken}`,
    },
  });

  return responseDeleteFollow;
}

export async function createAccount(dataToCreateAccount: {
  email: string | undefined;
  username: string | undefined;
  name: string | undefined;
  password: string | undefined;
}) {
  const urlToCreateAccount = `${BACKEND_URL}/auth/signup`;

  const responseCreateAccount = await fetch(urlToCreateAccount, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToCreateAccount),
  });

  return responseCreateAccount;
}

export async function loginToAccount(dataToLogin: {
  emailOrUsername: string | undefined;
  password: string | undefined;
}) {
  const urlToLogin = `${BACKEND_URL}/auth/login`;

  const responseLogin = await fetch(urlToLogin, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToLogin),
  });

  return responseLogin;
}

export async function editAccountInformation(dataToEditAccount: {
  newEmail: string | null;
  newName: string | null;
  newUsername: string | null;
  password: string;
}) {
  const urlToEditAccount = `${BACKEND_URL}/api/users/edit-account`;

  const responseEditAccount = await fetch(urlToEditAccount, {
    method: "PUT",
    credentials: "include",
    headers: {
      authorization: `Bearer ${user.userData?.accessToken}`,

      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToEditAccount),
  });

  return responseEditAccount;
}

export async function uploadImageProfilePicture(formData: FormData) {
  const urlToUploadProfilePicture = `${BACKEND_URL}/api/images/profilePictures`;
  const responseProfilePictureUpload = await fetch(urlToUploadProfilePicture, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      authorization: `Bearer ${user.userData?.accessToken}`,
    },
    body: formData,
  });

  return responseProfilePictureUpload;
}
