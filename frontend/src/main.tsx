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
import ProfilePage from "./pages/ProfilePage";
import ProtectedNoLoginRoute from "./components/ProtectedRoutes/ProtectedNoLoginRoutes";
import AccountSettingsPage from "./pages/AccountSettingsPage";

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
    path: "/profile/:userId",
    element: (
      <CheckAuth>
        <ProfilePage></ProfilePage>
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
