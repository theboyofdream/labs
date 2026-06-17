import { Link } from "wouter";
import { useAuth } from "../context/AuthContext.jsx";

export function Landing() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Newsletters</h1>
      <p>Aggregate RSS feeds and email sources into curated digests.</p>
      {user ? (
        <Link href="/dashboard">Go to Dashboard</Link>
      ) : (
        <Link href="/login">Get Started</Link>
      )}
    </div>
  );
}
