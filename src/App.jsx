import { CssBaseline } from '@mui/material';
import { ReactKeycloakProvider } from '@react-keycloak/web';
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

const eventLogger = (event, error) => {
  if (event === 'onAuthSuccess') {
    sessionStorage.setItem('keycloak-token', keycloak.token);
  }
};

function App() {
  return (
    <ReactKeycloakProvider authClient={keycloak} onEvent={eventLogger} initOptions={{ onLoad: 'login-required', pkceMethod: 'S256' }}>
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
    </ReactKeycloakProvider>
  );
}

export default App;
