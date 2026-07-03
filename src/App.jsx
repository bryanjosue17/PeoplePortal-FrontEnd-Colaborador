import { CssBaseline } from '@mui/material';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { CustomThemeProvider } from './context/ThemeContext';
import keycloak from './keycloak';
import Announcements from './pages/Announcements/Announcements';
import Benefits from './pages/Benefits/Benefits';
import Dashboard from './pages/Dashboard/Dashboard';
import Documents from './pages/Documents/Documents';
import Profile from './pages/Profile/Profile';
import Requests from './pages/Requests/Requests';

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
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/benefits" element={<Benefits />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </CustomThemeProvider>
    </ReactKeycloakProvider>
  );
}

export default App;
