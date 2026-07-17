import { CssBaseline } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { NotificationsProvider } from './context/NotificationsContext';
import { CustomThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/Login/LoginPage';
import Announcements from './pages/Announcements/Announcements';
import Benefits from './pages/Benefits/Benefits';
import Nomina from './pages/Nomina/Nomina';
import Dashboard from './pages/Dashboard/Dashboard';
import Documents from './pages/Documents/Documents';
import Profile from './pages/Profile/Profile';
import Requests from './pages/Requests/Requests';
import TeamRequests from './pages/TeamRequests/TeamRequests';

/**
 * Muestra el LoginPage si el usuario no está autenticado,
 * o las rutas protegidas si sí lo está.
 */
function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  // Mientras se restaura la sesión desde sessionStorage, no renderizar nada
  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <CustomThemeProvider>
        <CssBaseline />
        <LoginPage />
      </CustomThemeProvider>
    );
  }

  return (
    <CustomThemeProvider>
      <CssBaseline />
      <BrowserRouter>
        <NotificationsProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/benefits" element={<Benefits />} />
              <Route path="/nomina" element={<Nomina />} />
              <Route path="/team-requests" element={<TeamRequests />} />
            </Routes>
          </Layout>
        </NotificationsProvider>
      </BrowserRouter>
    </CustomThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
