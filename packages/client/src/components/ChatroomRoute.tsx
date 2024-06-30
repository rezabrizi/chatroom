import { Navigate, Outlet } from "react-router-dom";

const LoggedIn = () => {
  const token = localStorage.getItem("token");
  return !token ? <Navigate to="/login" replace /> : <Outlet />;
};

export default LoggedIn;
