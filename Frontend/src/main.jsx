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
import AdminDashboard from "./Pages/AdminDashboard";
import TextEditorMain from "./Components/TextEditor/TextEditorMain";
import DatasetPage from "./Components/Dataset/DatasetPage";
import Translator from "./Components/Translator/Translator";
import Documents from "./Components/Document/Documents";
import DocumentEditor from "./Components/Document/DocumentEditor";

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
      {
        path: "adminDashboard",
        element: <AdminDashboard />
      },
      {
        path: "texteditor/*",
        element: <TextEditorMain />,
      },
      {
        path: 'Dataset',
        element: <DatasetPage />
      },
      {
        path: 'translate',
        element: <Translator />
      },
      {
        path: 'documents',
        element: <Documents />
      },
      {
        path: 'document/:id',
        element: <DocumentEditor />
      }
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