import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "./app/AppShell";
import { RequireAuth } from "./app/RequireAuth";
import { RequireGuest } from "./app/RequireGuest";

import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/not-found/NotFound";

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
            <Home />
          </RequireAuth>
        ),
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
