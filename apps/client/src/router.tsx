import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "./app/AppShell";
import { RequireAuth } from "./app/RequireAuth";
import { RequireGuest } from "./app/RequireGuest";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/not-found/NotFound";
import TalesPage from "./pages/tales/TalesPage";
import Profile from "./pages/profile/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <TalesPage />
          </RequireAuth>
        ),
      },
      {
        path: "me/:username",
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>)
      },
      {
        path: "login",
        element: (
          <RequireGuest>
            <Login />
          </RequireGuest>
        ),
      },
      {
        path: "signup",
        element: (
          <RequireGuest>
            <SignUp />
          </RequireGuest>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
