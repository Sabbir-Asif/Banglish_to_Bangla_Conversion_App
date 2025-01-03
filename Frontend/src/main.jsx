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
import LlamaChat from "./Components/Chatbot/LlamaChat";


const router = createBrowserRouter([
  {
    path: "/sign-up",
    element: <SignUp />
  },
  {
    path: "/sign-in",
    element: <SignIn />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />
  },
  {
    path: '/chat',
    element: <LlamaChat />
  }
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
