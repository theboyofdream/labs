import { Link } from "wouter";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "./DefaultLayout.module.css";

export function DefaultLayout({ children }) {
  const { user } = useAuth();

  return (
    <div class={styles.layout}>
      <header class={styles.header}>
        <nav class={styles.nav}>
          <Link href="/" class={styles.logo}>Newsletters</Link>
          <div class={styles.links}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            {user ? (
              <Link href="/dashboard">Dashboard</Link>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </div>
        </nav>
      </header>
      <main class={styles.main}>{children}</main>
      <footer class={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Newsletters</p>
      </footer>
    </div>
  );
}
