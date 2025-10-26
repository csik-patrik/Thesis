import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();

  // if no user or missing token, redirect to error page
  if (!user || !user.token) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
