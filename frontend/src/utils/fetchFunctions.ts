//You should handle the try catch on where you're calling these functoins.

import axios, { isAxiosError } from "axios";
import { BACKEND_URL } from "../constants";
import { store } from "../services/redux-toolkit/store";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

//////////USER RELATED:
export async function createAccount(
  previousState: unknown,
  formData: FormData
) {
  const email = formData.get("email");
  const username = formData.get("username");
  const name = formData.get("name");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  try {
    const urlToCreateAccount = `${BACKEND_URL}/auth/signup`;

    console.log(email, username, name, password, confirmPassword);

    const responseCreateAccount = await axiosInstance.post(
      urlToCreateAccount,
      { email, username, name, password, confirmPassword },
      {
        withCredentials: true,
      }
    );

    return responseCreateAccount;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 400) {
          return {
            error: error.response.data.message,
            previousData: { email, username, name, password, confirmPassword },
          };
        }

        return {
          error: error.response.data.message,
          previousData: { email, username, name, password, confirmPassword },
        };
      }
    }
    return {
      error: "An error occurred",
      previousData: { email, username, name, password, confirmPassword },
    };
  }
}

export async function loginToAccount(
  previousState: unknown,
  formData: FormData
) {
  const emailOrUsername = formData.get("emailOrUsername");
  const password = formData.get("password");
  try {
    const urlToLogin = `${BACKEND_URL}/auth/login`;

    const responseLogin = await axiosInstance.post(
      urlToLogin,
      { emailOrUsername, password },
      {
        withCredentials: true,
      }
    );

    return responseLogin;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 400) {
          return {
            error: error.response.data.message,
            previousData: { emailOrUsername, password },
          };
        }

        return {
          error: error.response.data.message,
          previousData: { emailOrUsername, password },
        };
      }
    }
    return {
      error: "An error occurred",
      previousData: { emailOrUsername, password },
    };
  }
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

export async function editAccountInformation(
  previousData: unknown,
  formData: FormData
) {
  const newEmail = formData.get("newEmail");
  const newName = formData.get("newName");
  const newUsername = formData.get("newUsername");
  const password = formData.get("passwordToVerifyOne");
  const file = formData.get("imageInputProfilePicture") as File;
  try {
    const user = store.getState().auth.user;
    const urlToEditAccount = `${BACKEND_URL}/api/users/${user.userData?.id}`;

    const responseEditAccount = await axiosInstance.put(
      urlToEditAccount,
      { newEmail, newName, newUsername, password },
      {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${user.userData?.accessToken}`,
        },
      }
    );

    if (file.name !== "") {
      const formDataToUploadProfilePicture = new FormData();
      formDataToUploadProfilePicture.append("file", file);

      await uploadImageProfilePicture(formDataToUploadProfilePicture);
    }

    return responseEditAccount;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 400) {
          return {
            error: error.response.data.message,
            previousData: { newEmail, newName, newUsername, password },
          };
        }

        return {
          error: error.response.data.message,
          previousData: { newEmail, newName, newUsername, password },
        };
      }
    }
    return {
      error: "An error occurred",
      previousData: { newEmail, newName, newUsername, password },
    };
  }
}

export async function changePassword(
  previousData: unknown,
  formData: FormData
) {
  const newPassword = formData.get("newPassword");
  const confirmNewPassword = formData.get("confirmNewPassword");
  const password = formData.get("currentPassword");
  try {
    const user = store.getState().auth.user;
    const urlToChangePassword = `${BACKEND_URL}/api/users/:userId/password`;

    const responseChangePassword = await axiosInstance.put(
      urlToChangePassword,
      { newPassword, confirmNewPassword, password },
      {
        headers: {
          authorization: `Bearer ${user.userData?.accessToken}`,
        },
      }
    );

    return responseChangePassword;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 400) {
          return {
            error: error.response.data.message,
            previousData: { newPassword, confirmNewPassword, password },
          };
        }

        return {
          error: error.response.data.message,
          previousData: { newPassword, confirmNewPassword, password },
        };
      }
    }
    return {
      error: "An error occurred",
      previousData: { newPassword, confirmNewPassword, password },
    };
  }
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

export async function verifyEmail(dataToVerifyEmail: {
  userId: string | undefined;
  codeToVerifyEmail: string | undefined;
}) {
  const { userId, codeToVerifyEmail } = dataToVerifyEmail;
  const urlToVerifyEmail = `${BACKEND_URL}/auth/verify-email/${userId}/${codeToVerifyEmail}`;

  const responseVerifyEmail = await axiosInstance.put(urlToVerifyEmail, {
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
  const urlToResetPassword = `${BACKEND_URL}/auth/password/reset-password/:userId/:token`;
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
  console.log(postId);
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
  console.log(postId);
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
