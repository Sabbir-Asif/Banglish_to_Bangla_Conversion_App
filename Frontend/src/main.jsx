import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import LandingPage from "./Pages/LandingPage";
import ErrorPage from "./Pages/ErrorPage";
import SignUp from "./Pages/SIgnUp";
import SignIn from "./Pages/SIgnIn";
import ForgotPassword from "./Pages/ForgotPassword";
import AuthProvider from "./Components/Authentication/AuthProvider";
import Home from "./Pages/Home";
import ChatPage from "./Components/Chat/ChatPage";
import Banner from "./Components/Banner/Banner";


const router = createBrowserRouter([
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "banner",
        element: <Banner />
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
