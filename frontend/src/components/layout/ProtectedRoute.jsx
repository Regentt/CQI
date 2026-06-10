import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-6 h-6 rounded-full border-2 border-violet-600
                        border-t-transparent animate-spin"
        />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
