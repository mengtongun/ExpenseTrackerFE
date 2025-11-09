import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import { CategoriesPage } from "./pages/categories";
import { DashboardPage } from "./pages/dashboard";
import { ExpensesPage } from "./pages/expense";
import { LoginPage } from "./pages/login";
import { ProfilePage } from "./pages/profile";
import { RecurringPage } from "./pages/recurring";
import { RegisterPage } from "./pages/register";
import { ReportsPage } from "./pages/reports";
import { SettingsPage } from "./pages/settings";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { ThemeProvider } from "./theme";

function AppLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              element={
                <ProtectedRoute
                  fallback={<div className="p-6 text-secondary">Loading…</div>}
                />
              }
            >
              <Route element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="expenses" element={<ExpensesPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="recurring" element={<RecurringPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
