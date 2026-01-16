import { createBrowserRouter } from "react-router-dom";
import AppShell from "./app/AppShell";
import { RequireAuth } from "./app/RequireAuth";

import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/not-found/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <Home />
          </RequireAuth>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
