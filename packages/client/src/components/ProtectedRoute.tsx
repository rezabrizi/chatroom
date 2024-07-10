import { PropsWithChildren, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && token === null) {
      navigate("/login", { replace: true });
    }
  }, [navigate, token, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
