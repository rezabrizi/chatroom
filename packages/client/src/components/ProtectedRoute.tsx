import { Navigate, Outlet } from "react-router-dom";

const Anonymous = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/chatroom" replace /> : <Outlet />;
};

export default Anonymous;
