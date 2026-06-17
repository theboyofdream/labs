import { useEffect, useState } from "preact/hooks";
import { useAuth } from "../context/AuthContext.jsx";

export function Login() {
  const { user, login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      window.location.href = "/dashboard";
    }
  }, [user]);

  const handleGoogleLogin = async () => {
    setError(null);
    // In production, use @react-oauth/google or gsi script
    // This is a placeholder for the OAuth flow
    try {
      const { google } = window;
      if (!google) {
        setError("Google Sign-In not loaded. Ensure client ID is configured.");
        return;
      }
      const client = google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "email profile",
        callback: async (response) => {
          if (response.access_token) {
            // Exchange access token for ID token or use access token
            const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${response.access_token}` },
            }).then((r) => r.json());
            // For simplicity, we pass the access token
            // In production, properly verify on backend
            await login(userInfo.sub);
          }
        },
      });
      client.requestAccessToken();
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <p>Sign in to manage your sources and digests.</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="button" onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}
