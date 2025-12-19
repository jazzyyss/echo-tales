import { createBrowserRouter } from "react-router";

import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/not-found/NotFound";

export const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

//optional for outlet type root layout
/* {
  path: "/",
  element: <RootLayout />,
  children: [
    { path: "dashboard", element: <Home /> },
    { path: "login", element: <Login /> },
    { path: "signup", element: <SignUp /> },
  ],
} */