import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "/src/assets/main.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { store } from "./services/redux-toolkit/store";
import { Provider } from "react-redux";
import ProtectLoginRoutes from "./components/ProtectedRoutes/ProtectLoginRoutes";
import CheckAuth from "./components/ProtectedRoutes/CheckAuth";
import ProtectedNoLoginRoute from "./components/ProtectedRoutes/ProtectedNoLoginRoutes";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import CheckProfilePage from "./components/ProtectedRoutes/CheckProfilePage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CheckAuth>
        <HomePage></HomePage>
      </CheckAuth>
    ),
  },
  {
    path: "/create-post",
    element: (
      <ProtectedNoLoginRoute>
        <CreatePostPage></CreatePostPage>
      </ProtectedNoLoginRoute>
    ),
  },
  {
    path: "/post/:postId",
    element: (
      <CheckAuth>
        <PostPage></PostPage>
      </CheckAuth>
    ),
  },
  {
    path: "/profile/:userId",
    element: (
      <CheckAuth>
        <CheckProfilePage></CheckProfilePage>
      </CheckAuth>
    ),
  },
  {
    path: "/account-settings",
    element: (
      <ProtectedNoLoginRoute>
        <AccountSettingsPage></AccountSettingsPage>
      </ProtectedNoLoginRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <ProtectLoginRoutes>
        <ForgotPasswordPage></ForgotPasswordPage>
      </ProtectLoginRoutes>
    ),
  },
  {
    path: "/verify-email/:userId",
    element: <VerifyEmailPage></VerifyEmailPage>,
  },
  {
    path: "/login",
    element: (
      <ProtectLoginRoutes>
        <LoginPage></LoginPage>
      </ProtectLoginRoutes>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <ProtectLoginRoutes>
        <SignUpPage></SignUpPage>
      </ProtectLoginRoutes>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
