import { Link } from "wouter";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./Header.module.css";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header class={styles.header}>
      <nav class={styles.nav}>
        <Link href="/dashboard" class={styles.logo}>Newsletters</Link>
        <div class={styles.links}>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/settings">Settings</Link>
          {user?.role === "admin" && <Link href="/admin">Admin</Link>}
        </div>
        <div class={styles.user}>
          <span class={styles.email}>{user?.email}</span>
          <button type="button" onClick={logout} class={styles.logout}>
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
