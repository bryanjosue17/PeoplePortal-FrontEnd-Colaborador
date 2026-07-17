import { CssBaseline } from '@mui/material';
import { useKeycloak, ReactKeycloakProvider } from '@react-keycloak/web';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { NotificationsProvider } from './context/NotificationsContext';
import { CustomThemeProvider } from './context/ThemeContext';
import keycloak from './keycloak';
import Announcements from './pages/Announcements/Announcements';
import Benefits from './pages/Benefits/Benefits';
import Nomina from './pages/Nomina/Nomina';
import Dashboard from './pages/Dashboard/Dashboard';
import Documents from './pages/Documents/Documents';
import Profile from './pages/Profile/Profile';
import Requests from './pages/Requests/Requests';
import TeamRequests from './pages/TeamRequests/TeamRequests';

const eventLogger = (event, _error) => {
  if (event === 'onAuthSuccess' || event === 'onTokenRefreshed' || event === 'onAuthRefreshSuccess') {
    if (keycloak.token) {
      sessionStorage.setItem('keycloak-token', keycloak.token);
    }
  }
  if (event === 'onAuthLogout' || event === 'onAuthRefreshError') {
    sessionStorage.removeItem('keycloak-token');
  }
};

// Bloquea el render de rutas hasta que keycloak.authenticated === true
// Evita llamadas API sin token durante el ciclo PKCE inicial
function AuthGuard({ children }) {
  const { keycloak, initialized } = useKeycloak();
  if (!initialized || !keycloak.authenticated) return null;
  return children;
}

function App() {
  return (
    <ReactKeycloakProvider authClient={keycloak} onEvent={eventLogger} initOptions={{ onLoad: 'login-required', pkceMethod: 'S256', checkLoginIframe: false }}>
      <CustomThemeProvider>
        <CssBaseline />
        <BrowserRouter>
          <NotificationsProvider>
            <AuthGuard>
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
            </AuthGuard>
          </NotificationsProvider>
        </BrowserRouter>
      </CustomThemeProvider>
    </ReactKeycloakProvider>
  );
}

export default App;
