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
import UserDashboard from "./Pages/UserDashboard";
import Stories from "./Components/Stories/Stories";
import StoriesPage from "./Components/Stories/StoriesPage";
import WriterPage from "./Components/Writer/WriterPage";
import WriterDetails from "./Components/Writer/WriterDetails"; 
import PrivateRoute from "./Components/Authentication/PrivateRoute";

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
    element: <PrivateRoute>
      <Home />
    </PrivateRoute>,
    children: [
      {
        path: "banner",
        element: <PrivateRoute>
          <Banner />
        </PrivateRoute>
      },
      {
        path: "chat",
        element: <PrivateRoute>
          <ChatPage />
        </PrivateRoute>
      },
      {
        path: "adminDashboard",
        element: <PrivateRoute>
          <AdminDashboard />
        </PrivateRoute>
      },
      {
        path: "userDashboard",
        element: <PrivateRoute>
          <UserDashboard />
        </PrivateRoute>
      },
      {
        path: "texteditor/*",
        element: <PrivateRoute>
          <TextEditorMain />
        </PrivateRoute>
      },
      {
        path: 'Dataset',
        element: <PrivateRoute>
          <DatasetPage />
        </PrivateRoute>
      },
      {
        path: 'translate',
        element: <PrivateRoute>
          <Translator />
        </PrivateRoute>
      },
      {
        path: 'documents',
        element: <PrivateRoute>
          <Documents />
        </PrivateRoute>
      },
      {
        path: 'document/:id',
        element: <PrivateRoute>
          <DocumentEditor />
        </PrivateRoute>
      },
      {
        path: 'stories',
        element: <PrivateRoute>
          <Stories />
        </PrivateRoute>
      },
      {
        path: 'stories/:id',
        element: <PrivateRoute>
          <StoriesPage /> 
        </PrivateRoute>
      },
      {
        path: 'writer',
        element: <PrivateRoute>
          <WriterPage />
        </PrivateRoute>
      },
      {
        path: 'writer/:id',
        element: <PrivateRoute>
          <WriterDetails />
        </PrivateRoute>
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
