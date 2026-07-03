import AssignmentIcon from '@mui/icons-material/Assignment';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CampaignIcon from '@mui/icons-material/Campaign';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import {
  AppBar, Avatar, Badge, Box,
  Divider, Drawer,
  IconButton, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Menu, MenuItem, Toolbar, Typography
} from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotifications } from '../context/NotificationsContext';
import { useThemeContext } from '../context/ThemeContext';

const drawerWidth = 260;

const baseNavItems = [
  { icon: <DashboardIcon />, path: '/dashboard', text: 'Dashboard' },
  { icon: <PersonIcon />, path: '/profile', text: 'Mi Perfil' },
  { icon: <DescriptionIcon />, path: '/documents', text: 'Mis Documentos' },
  { icon: <AssignmentIcon />, path: '/requests', text: 'Solicitudes' },
  { icon: <CampaignIcon />, path: '/announcements', text: 'Comunicados' },
  { icon: <CardGiftcardIcon />, path: '/benefits', text: 'Beneficios' },
];

function Layout({ children }) {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { themeMode, toggleThemeMode } = useThemeContext();
  const [themeAnchorEl, setThemeAnchorEl] = useState(null);
  const { unreadCount, clearUnread } = useNotifications();

  // Detect jefe_inmediato role
  const roles = keycloak?.tokenParsed?.realm_access?.roles || [];
  const isManager = roles.includes('jefe_inmediato');

  const navItems = [
    ...baseNavItems,
    ...(isManager ? [{ icon: <GroupIcon />, path: '/team-requests', text: 'Mi Equipo' }] : []),
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    keycloak.logout();
  };

  const handleThemeMenuOpen = (e) => setThemeAnchorEl(e.currentTarget);
  const handleThemeMenuClose = () => setThemeAnchorEl(null);
  const handleThemeSelect = (mode) => {
    toggleThemeMode(mode);
    handleThemeMenuClose();
  };

  const getThemeIcon = () => {
    if (themeMode === 'light') return <Brightness7Icon />;
    if (themeMode === 'dark') return <Brightness4Icon />;
    return <SettingsBrightnessIcon />;
  };

  const token = keycloak?.tokenParsed;
  const userName = token?.name || token?.preferred_username || 'Usuario';
  const userEmail = token?.email || '';
  const userAvatar = userName.charAt(0).toUpperCase();

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1.5, p: 2.5, pb: 2 }}>
        <Box
          sx={{
            alignItems: 'center',
            background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
            borderRadius: 2,
            color: '#fff',
            display: 'flex',
            fontSize: 18,
            fontWeight: 800,
            height: 36,
            justifyContent: 'center',
            width: 36,
          }}
        >
          P
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 700, lineHeight: 1.2 }}>
            PeoplePortal
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Colaborador
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          ml: { md: `${drawerWidth}px` },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {navItems.find(i => i.path === location.pathname)?.text || 'PeoplePortal'}
          </Typography>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
            <IconButton
              color="inherit"
              sx={{ color: 'text.secondary' }}
              onClick={() => { clearUnread(); navigate('/requests'); }}
              title="Mis solicitudes"
            >
              <Badge badgeContent={unreadCount > 0 ? unreadCount : null} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={handleThemeMenuOpen} sx={{ mr: 1, color: 'text.secondary' }}>
              {getThemeIcon()}
            </IconButton>
            <Menu
              anchorEl={themeAnchorEl}
              open={Boolean(themeAnchorEl)}
              onClose={handleThemeMenuClose}
            >
              <MenuItem onClick={() => handleThemeSelect('light')} selected={themeMode === 'light'}>
                <ListItemIcon><Brightness7Icon fontSize="small" /></ListItemIcon>
                Claro
              </MenuItem>
              <MenuItem onClick={() => handleThemeSelect('dark')} selected={themeMode === 'dark'}>
                <ListItemIcon><Brightness4Icon fontSize="small" /></ListItemIcon>
                Oscuro
              </MenuItem>
              <MenuItem onClick={() => handleThemeSelect('system')} selected={themeMode === 'system'}>
                <ListItemIcon><SettingsBrightnessIcon fontSize="small" /></ListItemIcon>
                Sistema
              </MenuItem>
            </Menu>

            <Typography variant="body2" sx={{ display: { sm: 'block', xs: 'none' } }}>
              {userName}
            </Typography>
            <Avatar
              onClick={handleMenuOpen}
              sx={{ bgcolor: 'primary.main', cursor: 'pointer', fontSize: 16, height: 36, width: 36 }}
            >
              {userAvatar}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">{userEmail}</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ flexShrink: { md: 0 }, width: { md: drawerWidth } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            display: { md: 'none', xs: 'block' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            display: { md: 'block', xs: 'none' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          bgcolor: 'background.default',
          boxSizing: 'border-box',
          flexGrow: 1,
          minHeight: '100vh',
          minWidth: 0,
          mt: 8,
          overflow: 'hidden',
          p: { sm: 3, xs: 2 },
          width: { md: `calc(100% - ${drawerWidth}px)`, xs: '100%' },
        }}
      >
        {children}
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar closeOnClick theme="colored" />
      </Box>
    </Box>
  );
}

export default Layout;
