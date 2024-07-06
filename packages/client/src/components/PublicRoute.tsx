import { PropsWithChildren, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

type PublicRouteProps = PropsWithChildren;

export default function PublicRoute({ children }: PublicRouteProps) {
  const { token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && token !== null) {
      navigate("/protected_example", { replace: true }); // Redirect to protected route
    }
  }, [navigate, token, loading]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while checking the token
  }

  return <>{children}</>;
}
