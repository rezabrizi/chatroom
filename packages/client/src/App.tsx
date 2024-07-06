import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthProvider from "./context/authContext";
import Protected_Example from "./components/protected_example";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute"; // Import the PublicRoute component

const router = createBrowserRouter([
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
]);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
