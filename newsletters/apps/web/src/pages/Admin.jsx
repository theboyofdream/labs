import { useState, useEffect } from "preact/hooks";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";

export function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.role === "admin") {
      // Admin would have additional endpoints
      // For now, show placeholder
    }
  }, [user]);

  if (user?.role !== "admin") {
    return <p>Access denied. Admin only.</p>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <section>
        <h2>System Overview</h2>
        <p>Manage users, sources, and system settings.</p>
      </section>
    </div>
  );
}
