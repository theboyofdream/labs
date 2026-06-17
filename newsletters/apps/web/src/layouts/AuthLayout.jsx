import { useAuth } from "../context/AuthContext.jsx";
import { Header } from "../components/Header.jsx";
import styles from "./AuthLayout.module.css";

export function AuthLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div class={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div class={styles.redirect}>
        <p>Please log in to continue.</p>
        <a href="/login">Go to Login</a>
      </div>
    );
  }

  return (
    <div class={styles.layout}>
      <Header />
      <main class={styles.main}>{children}</main>
    </div>
  );
}
