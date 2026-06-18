import { useState } from "preact/hooks";
import { Link } from "wouter";
import { useAuth } from "../context/AuthContext.jsx";

export function Landing() {
  const { user } = useAuth();
  const [hover, setHover] = useState(null);

  if (user) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
        <h1>One place for everything worth reading.</h1>
        <p style={{ fontSize: "1.125rem", maxWidth: "32rem", margin: "0 auto 2rem" }}>
          Bring newsletters and RSS feeds together, delivered on your schedule.
        </p>
        <Link href="/dashboard">Go to Dashboard</Link>
      </div>
    );
  }

  const btnStyle = (isHovered, isDisabled) => ({
    display: "block",
    padding: "0.625rem 1.5rem",
    border: isHovered ? "1px solid var(--primary)" : `1px solid var(--border)`,
    background: isHovered ? "var(--primary)" : "transparent",
    color: isHovered ? "var(--primary-foreground)" : "inherit",
    fontSize: "1rem",
    textAlign: "center",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled && !isHovered ? 0.5 : 1,
  });

  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <h1>One place for everything worth reading.</h1>
      <p style={{ fontSize: "1.125rem", maxWidth: "32rem", margin: "0 auto 2rem" }}>
        Bring newsletters and RSS feeds together, delivered on your schedule.
      </p>
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          gap: "0.75rem",
          padding: "1.5rem",
          minWidth: "16rem",
        }}
      >
          <h3
          style={{
            margin: 0,
            fontSize: "0.875rem",
            fontWeight: 400,
            color: "var(--muted-foreground)",
            textAlign: "center",
          }}
        >
          continue with
        </h3>
        <Link
          href="/login"
          style={btnStyle(hover === "google", false)}
          onMouseEnter={() => setHover("google")}
          onMouseLeave={() => setHover(null)}
        >
          Google
        </Link>
        <span
          style={btnStyle(hover === "apple", true)}
          onMouseEnter={() => setHover("apple")}
          onMouseLeave={() => setHover(null)}
        >
          Apple
        </span>
      </div>
    </div>
  );
}
