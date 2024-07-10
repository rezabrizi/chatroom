import React from "react";
import { useAuth } from "../context/authContext";

const Logout: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
