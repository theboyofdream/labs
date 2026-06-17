import { useAuth } from "../context/AuthContext.jsx";

export function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <div>
        <p>Please log in to continue.</p>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  if (requiredRole === "admin" && user.role !== "admin") {
    return (
      <div>
        <p>Access denied. Admin only.</p>
        <a href="/dashboard">Back to Dashboard</a>
      </div>
    );
  }

  return <>{children}</>;
}
