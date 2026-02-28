import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Spinner from "../Components/Shared/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner fullPage />;
  }

  if (!user || !user.token) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
