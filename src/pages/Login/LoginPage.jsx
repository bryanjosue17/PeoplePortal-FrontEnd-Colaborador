import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setError('');
    setLoading(true);
    try {
      await login(username.trim(), password);
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0D1B2A 0%, #1565C0 50%, #0D47A1 100%)',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Orbs decorativos de fondo */}
      <Box
        sx={{
          animation: 'float 8s ease-in-out infinite',
          background: 'radial-gradient(circle, rgba(96,165,250,0.25) 0%, transparent 70%)',
          borderRadius: '50%',
          height: 600,
          left: -200,
          position: 'absolute',
          top: -150,
          width: 600,
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) scale(1)' },
            '50%': { transform: 'translateY(-30px) scale(1.05)' },
          },
        }}
      />
      <Box
        sx={{
          animation: 'float 10s ease-in-out infinite reverse',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: -200,
          height: 500,
          position: 'absolute',
          right: -150,
          width: 500,
        }}
      />

      {/* Card de login */}
      <Box
        sx={{
          backdropFilter: 'blur(20px)',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(96,165,250,0.25)',
          borderRadius: 4,
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(96,165,250,0.15)',
          maxWidth: 420,
          mx: 2,
          p: { sm: 5, xs: 4 },
          position: 'relative',
          width: '100%',
          zIndex: 1,
        }}
      >
        {/* Logo + Nombre */}
        <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', mb: 4 }}>
          <Box
            sx={{
              alignItems: 'center',
              background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(59,130,246,0.4)',
              color: '#fff',
              display: 'flex',
              fontSize: 28,
              fontWeight: 900,
              height: 64,
              justifyContent: 'center',
              mb: 2.5,
              width: 64,
            }}
          >
            P
          </Box>
          <Typography
            variant="h5"
            sx={{ color: '#E2E8F0', fontWeight: 700, letterSpacing: '-0.01em', mb: 0.5 }}
          >
            PeoplePortal
          </Typography>
          <Typography
            variant="caption"
            sx={{
              background: 'rgba(96, 165, 250, 0.15)',
              border: '1px solid rgba(96, 165, 250, 0.4)',
              borderRadius: 10,
              boxShadow: '0 0 12px rgba(96, 165, 250, 0.2)',
              color: '#93C5FD',
              fontWeight: 700,
              letterSpacing: '0.12em',
              px: 2,
              py: 0.4,
              textTransform: 'uppercase',
            }}
          >
            Colaborador
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3, textAlign: 'center' }}>
          Ingresa tus credenciales para acceder al portal
        </Typography>

        <Collapse in={!!error}>
          <Alert
            severity="error"
            sx={{
              backgroundColor: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 2,
              color: '#FCA5A5',
              mb: 2.5,
              '& .MuiAlert-icon': { color: '#F87171' },
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        </Collapse>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            id="login-username"
            autoComplete="username"
            autoFocus
            disabled={loading}
            fullWidth
            label="Usuario"
            margin="normal"
            onChange={(e) => setUsername(e.target.value)}
            required
            size="medium"
            value={username}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlinedIcon sx={{ color: '#60A5FA', fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                color: '#E2E8F0',
                '& fieldset': { borderColor: 'rgba(96,165,250,0.25)' },
                '&:hover fieldset': { borderColor: 'rgba(96,165,250,0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#60A5FA' },
              },
              '& .MuiInputLabel-root': { color: '#94A3B8' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#60A5FA' },
            }}
          />

          <TextField
            id="login-password"
            autoComplete="current-password"
            disabled={loading}
            fullWidth
            label="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            required
            size="medium"
            type={showPassword ? 'text' : 'password'}
            value={password}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#60A5FA', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      onClick={() => setShowPassword((s) => !s)}
                      sx={{ color: '#94A3B8' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                color: '#E2E8F0',
                '& fieldset': { borderColor: 'rgba(96,165,250,0.25)' },
                '&:hover fieldset': { borderColor: 'rgba(96,165,250,0.5)' },
                '&.Mui-focused fieldset': { borderColor: '#60A5FA' },
              },
              '& .MuiInputLabel-root': { color: '#94A3B8' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#60A5FA' },
            }}
          />

          <Button
            id="login-submit-btn"
            disabled={loading || !username || !password}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            sx={{
              background: loading
                ? 'rgba(59,130,246,0.5)'
                : 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
              borderRadius: 2.5,
              boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
              color: '#fff',
              fontWeight: 700,
              height: 50,
              letterSpacing: '0.02em',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #93C5FD 0%, #60A5FA 100%)',
                boxShadow: '0 6px 28px rgba(59,130,246,0.55)',
                transform: 'translateY(-1px)',
              },
              '&:active': { transform: 'translateY(0)' },
              '&.Mui-disabled': {
                background: 'rgba(30, 41, 59, 0.9) !important',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                color: '#64748B !important',
              },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Iniciar Sesión'}
          </Button>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: 'rgba(148,163,184,0.5)', display: 'block', mt: 4, textAlign: 'center' }}
        >
          © {new Date().getFullYear()} PeoplePortal — Acceso restringido
        </Typography>
      </Box>
    </Box>
  );
}
