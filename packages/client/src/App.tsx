import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Register from "./components/Register";
import AuthProvider from "./context/authContext";
import Protected_Example from "./components/protected_example";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Header from "./components/ProfileHeader";

const router = createBrowserRouter([
  {
    path: "/Logout",
    element: (
      <ProtectedRoute>
        <Logout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/protected_example",
    element: (
      <ProtectedRoute>
        <Protected_Example />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
]);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Header />
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
