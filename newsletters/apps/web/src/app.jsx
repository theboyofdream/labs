import { Route, Switch } from "wouter";
import { AuthProvider } from "./context/AuthContext.jsx";
import { DefaultLayout } from "./layouts/DefaultLayout.jsx";
import { AuthLayout } from "./layouts/AuthLayout.jsx";
import { Landing } from "./pages/Landing.jsx";
import { Privacy } from "./pages/Privacy.jsx";
import { Terms } from "./pages/Terms.jsx";
import { Login } from "./pages/Login.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Settings } from "./pages/Settings.jsx";
import { Admin } from "./pages/Admin.jsx";

export function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={() => <DefaultLayout><Landing /></DefaultLayout>} />
        <Route path="/privacy" component={() => <DefaultLayout><Privacy /></DefaultLayout>} />
        <Route path="/terms" component={() => <DefaultLayout><Terms /></DefaultLayout>} />
        <Route path="/login" component={() => <AuthLayout><Login /></AuthLayout>} />
        <Route path="/dashboard" component={() => <AuthLayout><Dashboard /></AuthLayout>} />
        <Route path="/settings" component={() => <AuthLayout><Settings /></AuthLayout>} />
        <Route path="/admin" component={() => <AuthLayout><Admin /></AuthLayout>} />
        <Route component={() => <DefaultLayout><NotFound /></DefaultLayout>} />
      </Switch>
    </AuthProvider>
  );
}

function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>Page not found</p>
      <a href="/">Go home</a>
    </main>
  );
}
