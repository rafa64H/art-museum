//You should handle the try catch on where you're calling these functoins.

import axios from "axios";
import { BACKEND_URL } from "../constants";
import { store } from "../services/redux-toolkit/store";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

//////////USER RELATED:
export async function createAccount(dataToCreateAccount: {
  email: string | undefined;
  username: string | undefined;
  name: string | undefined;
  password: string | undefined;
}) {
  const urlToCreateAccount = `${BACKEND_URL}/auth/signup`;

  const responseCreateAccount = axiosInstance.post(
    urlToCreateAccount,
    dataToCreateAccount,
    {
      withCredentials: true,
    }
  );

  return responseCreateAccount;
}

export async function loginToAccount(dataToLogin: {
  emailOrUsername: string | undefined;
  password: string | undefined;
}) {
  const urlToLogin = `${BACKEND_URL}/auth/login`;

  const responseLogin = await axiosInstance.post(urlToLogin, dataToLogin, {
    withCredentials: true,
  });

  return responseLogin;
}

export async function getUser(dataToGetUser: {
  userIdParam: string | undefined;
}) {
  const { userIdParam } = dataToGetUser;

  const urlToGetUser = `${BACKEND_URL}/api/users/${userIdParam}`;
  const user = store.getState().auth.user;

  const responseGetUser = await axiosInstance.get(urlToGetUser, {
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

  const responseEditAccount = await axiosInstance.put(
    urlToEditAccount,
    dataToEditAccount,
    {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${user.userData?.accessToken}`,
      },
    }
  );

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

  const responseChangePassword = await axiosInstance.put(
    urlToChangePassword,
    dataToChangeAccount,
    {
      headers: {
        authorization: `Bearer ${user.userData?.accessToken}`,
      },
    }
  );

  return responseChangePassword;
}

export async function addFollow(userProfileId: string | undefined) {
  const user = store.getState().auth.user;
  const urlToAddFollow = `${BACKEND_URL}/api/users/followers/${userProfileId}`;

  const responseAddFollow = await axiosInstance.post(
    urlToAddFollow,
    {},
    {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${user.userData?.accessToken}`,
      },
    }
  );

  return responseAddFollow;
}

export async function deleteFollow(userProfileId: string | undefined) {
  const user = store.getState().auth.user;
  const urlToDeleteFollow = `${BACKEND_URL}/api/users/followers/${userProfileId}`;

  const responseDeleteFollow = await axiosInstance.delete(urlToDeleteFollow, {
    headers: {
      authorization: `Bearer ${user.userData?.accessToken}`,
    },
  });

  return responseDeleteFollow;
}

export async function requestEmailChangeCode(userId: string | undefined) {
  const urlGetVerificationCode = `${BACKEND_URL}/auth/request-email-code/${userId}`;

  const responseSendVerificationCode = await axiosInstance.get(
    urlGetVerificationCode
  );
  return responseSendVerificationCode;
}

export async function undoEmailChange() {
  const user = store.getState().auth.user;
  const urlToUndoEmalChange = `${BACKEND_URL}/api/users/undo-email-change`;

  const responseUndoEmailChange = await axios(urlToUndoEmalChange, {
    withCredentials: true,
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
  const urlToVerifyEmail = `${BACKEND_URL}/auth/verify-email`;

  const responseVerifyEmail = await axiosInstance.post(urlToVerifyEmail, {
    userId: userId,
    code: codeToVerifyEmail,
  });
  return responseVerifyEmail;
}

export async function getFollowersAndFollowings() {
  const user = store.getState().auth.user;
  const urlToGetFollowersAndFollowings = `${BACKEND_URL}/api/users/followers/${user.userData?.id}`;

  const responseGetFollowersAndFollowings = await axiosInstance.get(
    urlToGetFollowersAndFollowings,
    {
      headers: {
        authorization: `Bearer ${user.userData?.accessToken}`,
      },
    }
  );
  return responseGetFollowersAndFollowings;
}

export async function forgotPasswordFetch(dataToForgotPasswordFetch: {
  emailOrUsername: string | undefined;
}) {
  const { emailOrUsername } = dataToForgotPasswordFetch;
  const urlToSendTokenForgotPassword = `${BACKEND_URL}/auth/password/forgot-password`;

  const responseForgotPassword = await axiosInstance.put(
    urlToSendTokenForgotPassword,
    { emailOrUsername: emailOrUsername }
  );
  return responseForgotPassword;
}

export async function resetPassword(dataToResetPassword: {
  password: string | undefined;
  token: string | undefined;
  emailOrUsername: string | undefined;
}) {
  const urlToResetPassword = `${BACKEND_URL}/auth/password/reset-password`;

  const { password, token, emailOrUsername } = dataToResetPassword;

  const responseResetPassword = await axiosInstance.put(urlToResetPassword, {
    password,
    token,
    emailOrUsername,
  });
  return responseResetPassword;
}

export async function fetchRefreshAuth() {
  const urlForRefresh = `${BACKEND_URL}/auth/refresh`;

  const responseRefresh = await axiosInstance.get(urlForRefresh, {
    withCredentials: true,
  });
  return responseRefresh;
}

////////POSTS RELATED
export async function createPost(dataToCreatePost: {
  title: string | undefined;
  content: string | undefined;
  tags: string[] | [];
}) {
  const user = store.getState().auth.user;
  const urlCreatePost = `${BACKEND_URL}/api/posts`;

  const responsePostModel = await axiosInstance.post(
    urlCreatePost,
    dataToCreatePost,
    {
      headers: {
        authorization: `Bearer ${user.userData?.accessToken}`,
      },
    }
  );
  return responsePostModel;
}

export async function getSinglePost(postId: string | undefined) {
  const urlGetSinglePost = `${BACKEND_URL}/api/posts/${postId}`;

  const responseGetSinglePost = await axiosInstance.get(urlGetSinglePost);
  return responseGetSinglePost;
}

export async function likePost(postId: string | undefined) {
  const urlToLikePost = `${BACKEND_URL}/api/posts/${postId}/likes`;
  const user = store.getState().auth.user;

  const responseLikePost = await axiosInstance.post(
    urlToLikePost,
    {},
    {
      headers: {
        Authorization: `Bearer ${user.userData?.accessToken}`,
      },
    }
  );

  return responseLikePost;
}

export async function dislikePost(postId: string | undefined) {
  const urlToDislikePost = `${BACKEND_URL}/api/posts/${postId}/dislikes`;
  const user = store.getState().auth.user;

  const responseDislikePost = await axiosInstance.post(
    urlToDislikePost,
    {},
    {
      headers: {
        Authorization: `Bearer ${user.userData?.accessToken}`,
      },
    }
  );

  return responseDislikePost;
}
export async function getCommentsFromPost(postId: string | undefined) {
  const urlGetComments = `${BACKEND_URL}/api/posts/${postId}/comments`;

  const responseGetComments = await axiosInstance.get(urlGetComments);

  return responseGetComments;
}

export async function createComment(
  postId: string | undefined,
  commentContent: string
) {
  const user = store.getState().auth.user;
  const urlToCreateComment = `${BACKEND_URL}/api/posts/${postId}/comments`;

  const responseCreateComment = await axiosInstance.post(
    urlToCreateComment,
    { content: commentContent },
    {
      headers: {
        authorization: "Bearer " + user.userData?.accessToken,
      },
    }
  );

  return responseCreateComment;
}

export async function likeComment(
  postId: string | undefined,
  commentId: string | undefined
) {
  const urlToLikeComment = `${BACKEND_URL}/api/posts/${postId}/comments/${commentId}/likes/`;
  const user = store.getState().auth.user;

  const responseLikeComment = await axiosInstance.post(
    urlToLikeComment,
    {},
    {
      headers: {
        Authorization: `Bearer ${user.userData?.accessToken}`,
      },
    }
  );

  return responseLikeComment;
}

export async function dislikeComment(
  postId: string | undefined,
  commentId: string | undefined
) {
  const urlToDisikeComment = `${BACKEND_URL}/api/posts/${postId}/comments/${commentId}/dislikes/`;

  const user = store.getState().auth.user;

  const responseDislikeComment = await axiosInstance.post(
    urlToDisikeComment,
    {},
    {
      headers: {
        authorization: `Bearer ${user.userData?.accessToken}`,
      },
    }
  );

  return responseDislikeComment;
}

export async function createReplyToComment(dataToCreateReplyToComment: {
  postId: string | undefined;
  commentId: string | undefined;
  replyContent: string | undefined;
}) {
  const user = store.getState().auth.user;
  const { postId, commentId, replyContent } = dataToCreateReplyToComment;

  const urlToPostReply = `${BACKEND_URL}/api/posts/${postId}/comments/${commentId}/replies`;

  const responsePostReply = await axiosInstance.post(
    urlToPostReply,
    { content: replyContent },
    {
      headers: {
        authorization: "Bearer " + user.userData?.accessToken,
      },
    }
  );

  return responsePostReply;
}

export async function getRepliesFromComment(dataToGetRepliesFromComment: {
  postId: string | undefined;
  commentId: string | undefined;
}) {
  const { postId, commentId } = dataToGetRepliesFromComment;
  const urlToGetReplies = `${BACKEND_URL}/api/posts/${postId}/comments/${commentId}/replies`;

  const responseGetReplies = await axiosInstance.get(urlToGetReplies);
  return responseGetReplies;
}

export async function likeReply(
  postId: string | undefined,
  commentId: string | undefined,
  replyId: string | undefined
) {
  const urlToLikeReply = `${BACKEND_URL}/api/posts/${postId}/comments/${commentId}/replies/${replyId}/likes`;
  const user = store.getState().auth.user;

  const responseLikeReply = await axiosInstance.post(
    urlToLikeReply,
    {},
    {
      headers: {
        Authorization: `Bearer ${user.userData?.accessToken}`,
      },
    }
  );

  return responseLikeReply;
}

export async function dislikeReply(
  postId: string | undefined,
  commentId: string | undefined,
  replyId: string | undefined
) {
  const urlToDislikeReply = `${BACKEND_URL}/api/posts/${postId}/comments/${commentId}/replies/${replyId}/dislikes`;
  const user = store.getState().auth.user;

  const responseDislikeReply = await axiosInstance.post(
    urlToDislikeReply,
    {},
    {
      headers: {
        Authorization: `Bearer ${user.userData?.accessToken}`,
      },
    }
  );

  return responseDislikeReply;
}

//////////IMAGES RELATED:
export async function uploadImageProfilePicture(
  formDataToUploadProfilePicture: FormData
) {
  const user = store.getState().auth.user;
  const urlToUploadProfilePicture = `${BACKEND_URL}/api/images/profilePictures`;
  const formData = formDataToUploadProfilePicture;

  const responseProfilePictureUpload = await axios.post(
    urlToUploadProfilePicture,
    formData,
    {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${user.userData?.accessToken}`,
      },
    }
  );

  return responseProfilePictureUpload;
}
export async function uploadPostImages(formDataToUpload: FormData) {
  const user = store.getState().auth.user;
  const urlPostImages = `${BACKEND_URL}/api/images/postImages`;
  const formData = formDataToUpload;
  const responsePostImages = await axiosInstance.post(urlPostImages, formData, {
    headers: {
      authorization: `Bearer ${user.userData?.accessToken}`,
    },
  });
  return responsePostImages;
}

export async function getPostImages(postId: string | undefined) {
  const urlPostImages = `${BACKEND_URL}/api/images/postImages/${postId}`;
  const responseGetPostImages = await axiosInstance.get(urlPostImages, {});

  return responseGetPostImages;
}
