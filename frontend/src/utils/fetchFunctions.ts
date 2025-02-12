//You should handle the try catch on where you're calling these functoins.

import { BACKEND_URL } from "../constants";
import { store } from "../services/redux-toolkit/store";

//////////USER RELATED:
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

export async function getUser(dataToGetUser: {
  userIdParam: string | undefined;
}) {
  const { userIdParam } = dataToGetUser;

  const urlToGetUser = `${BACKEND_URL}/api/users/${userIdParam}`;
  const user = store.getState().auth.user;

  const responseGetUser = await fetch(urlToGetUser, {
    method: "GET",
    headers: {
      authorization: `Bearer ${user.userData?.accessToken}`,
    },
  });
  return responseGetUser;
}

export async function editAccountInformation(dataToEditAccount: {
  newEmail: string | null;
  newName: string | null;
  newUsername: string | null;
  password: string;
}) {
  const user = store.getState().auth.user;
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

export async function changePassword(dataToChangeAccount: {
  newPassword: string | null;
  password: string;
}) {
  const urlToChangePassword = `${BACKEND_URL}/api/users/change-password`;
  const user = store.getState().auth.user;

  const { newPassword } = dataToChangeAccount;

  if (!newPassword) return;

  const responseChangePassword = await fetch(urlToChangePassword, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${user.userData?.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToChangeAccount),
  });

  return responseChangePassword;
}

export async function addFollow(userProfileId: string | undefined) {
  const user = store.getState().auth.user;
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
  const user = store.getState().auth.user;
  const urlToDeleteFollow = `${BACKEND_URL}/api/users/followers/${userProfileId}`;

  const responseDeleteFollow = await fetch(urlToDeleteFollow, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${user.userData?.accessToken}`,
    },
  });

  return responseDeleteFollow;
}

export async function requestEmailChangeCode(userId: string | undefined) {
  const urlGetVerificationCode = `${BACKEND_URL}/auth/request-email-code/${userId}`;
  const responseSendVerificationCode = await fetch(urlGetVerificationCode, {
    method: "GET",
  });
  return responseSendVerificationCode;
}

export async function undoEmailChange() {
  const user = store.getState().auth.user;
  const urlToUndoEmalChange = `${BACKEND_URL}/api/users/undo-email-change`;
  const responseUndoEmailChange = await fetch(urlToUndoEmalChange, {
    method: "PUT",
    credentials: "include",
    headers: {
      authorization: `Bearer ${user.userData?.accessToken}`,
    },
  });
  return responseUndoEmailChange;
}

export async function verifyEmail(dataToVerifyEmail: {
  userId: string | undefined;
  codeToVerifyEmail: string | undefined;
}) {
  const { userId, codeToVerifyEmail } = dataToVerifyEmail;
  const url = `${BACKEND_URL}/auth/verify-email`;

  const responseVerifyEmail = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      code: codeToVerifyEmail,
    }),
  });
  return responseVerifyEmail;
}

export async function getFollowersAndFollowings() {
  const user = store.getState().auth.user;
  const url = `${BACKEND_URL}/api/users/followers/${user.userData?.id}`;

  const responseGetFollowersAndFollowings = await fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${user.userData?.accessToken}`,
    },
  });
  return responseGetFollowersAndFollowings;
}

export async function forgotPasswordFetch(dataToForgotPasswordFetch: {
  emailOrUsername: string | undefined;
}) {
  const { emailOrUsername } = dataToForgotPasswordFetch;
  const url = `${BACKEND_URL}/auth/password/forgot-password`;

  const responseForgotPassword = await fetch(url, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emailOrUsername: emailOrUsername,
    }),
  });
  return responseForgotPassword;
}

export async function resetPassword(dataToResetPassword: {
  password: string | undefined;
  token: string | undefined;
  emailOrUsername: string | undefined;
}) {
  const url = `${BACKEND_URL}/auth/password/reset-password`;

  const { password, token, emailOrUsername } = dataToResetPassword;

  const responseResetPassword = await fetch(url, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
      token,
      emailOrUsername,
    }),
  });
  return responseResetPassword;
}

////////POSTS RELATED
export async function createPost(dataToCreatePost: {
  title: string | undefined;
  content: string | undefined;
  imageURLs: string[];
  imageIds: string[];
  tags: string[] | [];
}) {
  const user = store.getState().auth.user;
  const urlCreatePost = `${BACKEND_URL}/api/posts`;
  const responsePostModel = await fetch(urlCreatePost, {
    method: "POST",
    headers: {
      authorization: `Bearer ${user.userData?.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToCreatePost),
  });
  return responsePostModel;
}

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
  commentContent: string
) {
  const user = store.getState().auth.user;
  const urlToCreateComment = `${BACKEND_URL}/api/posts/${postId}/comments`;
  const responseCreateComment = await fetch(urlToCreateComment, {
    headers: {
      authorization: "Bearer " + user.userData?.accessToken,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      content: commentContent,
    }),
  });

  return responseCreateComment;
}

export async function createReplyToComment(dataToCreateReplyToComment: {
  postId: string | undefined;
  commentId: string | undefined;
  replyContent: string | undefined;
}) {
  const user = store.getState().auth.user;
  const { postId, commentId, replyContent } = dataToCreateReplyToComment;

  const urlToPostReply = `${BACKEND_URL}/api/posts/${postId}/comments/${commentId}/replies`;
  const responsePostReply = await fetch(urlToPostReply, {
    method: "POST",
    headers: {
      authorization: "Bearer " + user.userData?.accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: replyContent,
    }),
  });
  return responsePostReply;
}

export async function getRepliesFromComment(dataToGetRepliesFromComment: {
  postId: string | undefined;
  commentId: string | undefined;
}) {
  const { postId, commentId } = dataToGetRepliesFromComment;
  const urlToGetReplies = `${BACKEND_URL}/api/posts/${postId}/comments/${commentId}/replies`;

  const responseGetReplies = await fetch(urlToGetReplies, {
    method: "GET",
  });
  return responseGetReplies;
}

//////////IMAGES RELATED:
export async function uploadImageProfilePicture(formData: FormData) {
  const user = store.getState().auth.user;
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
export async function uploadPostImages(formDataToUpload: FormData) {
  const user = store.getState().auth.user;
  const urlPostImages = `${BACKEND_URL}/api/images/postImages`;
  const responsePostImages = await fetch(urlPostImages, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      authorization: `Bearer ${user.userData?.accessToken}`,
    },
    body: formDataToUpload,
  });
  return responsePostImages;
}
