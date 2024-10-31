import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "/src/assets/main.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { store } from "./services/redux-toolkit/store";
import { Provider } from "react-redux";
import ProtectLoginRoutes from "./components/ProtectLoginRoutes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage></HomePage>,
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
  </StrictMode>,
);
