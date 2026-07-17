import AssignmentIcon from '@mui/icons-material/Assignment';
import CampaignIcon from '@mui/icons-material/Campaign';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import { Alert, Box, Card, CardContent, Chip, Grid, Paper, Skeleton, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { getDashboard } from '../../api/dashboard';
import DiceAvatar from '../../components/DiceAvatar';

function StatCard({ icon, title, value, color }) {
  return (
    <Card sx={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)',
      backdropFilter: 'blur(12px)',
      border: '1px solid',
      borderColor: 'divider',
      borderTop: `4px solid ${color}`,
      borderRadius: 3,
      height: '100%',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': { 
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 24px -10px ${alpha(color, 0.3)}`,
        borderColor: alpha(color, 0.4),
      },
    }}>
      <CardContent sx={{ alignItems: 'center', display: 'flex', gap: 2.5, p: 3 }}>
        <Box sx={{
          alignItems: 'center',
          background: `linear-gradient(135deg, ${alpha(color, 0.2)}, ${alpha(color, 0.05)})`,
          border: `1px solid ${alpha(color, 0.3)}`,
          borderRadius: 2.5,
          color,
          display: 'flex',
          justifyContent: 'center',
          p: 2,
          boxShadow: `0 4px 12px ${alpha(color, 0.15)}`,
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1.1, mb: 0.5 }}>{value}</Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>{title}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboard()
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const userName = user?.name || user?.preferred_username || 'Colaborador';
  const displayEmail = user?.email || 'user@forza.com';

  if (error) {
    return (
      <Box>
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.08) 100%)',
            backdropFilter: 'blur(12px)',
            borderRadius: 3,
            mb: 4,
            p: { xs: 3, md: 4 },
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <DiceAvatar seed={displayEmail} size={64} />
            <Box>
              <Typography variant="h4" fontWeight={800}>¡Hola, {userName}!</Typography>
              <Typography variant="body2" color="text.secondary">Panel de control y autogestión de Forza</Typography>
            </Box>
          </Box>
        </Paper>
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          No se pudieron cargar los datos del dashboard. Algunas funciones pueden no estar disponibles.
        </Alert>
        <Grid container spacing={3}>
          <Grid size={{ md: 4, sm: 6, xs: 12 }}>
            <StatCard icon={<AssignmentIcon sx={{ fontSize: 28 }} />} title="Solicitudes Pendientes" value="--" color="#ed6c02" />
          </Grid>
          <Grid size={{ md: 4, sm: 6, xs: 12 }}>
            <StatCard icon={<DescriptionIcon sx={{ fontSize: 28 }} />} title="Documentos Disponibles" value="--" color="#1565c0" />
          </Grid>
          <Grid size={{ md: 4, sm: 6, xs: 12 }}>
            <StatCard icon={<CampaignIcon sx={{ fontSize: 28 }} />} title="Comunicados Activos" value="--" color="#7b1fa2" />
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Banner Superior Glassmorphism con Gradiente Dinámico */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.1) 100%)',
          backdropFilter: 'blur(16px)',
          borderRadius: 3,
          mb: 4,
          p: { xs: 3, md: 4.5 },
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'rgba(59,130,246,0.25)',
          boxShadow: '0 8px 32px rgba(59,130,246,0.08)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ p: 0.5, borderRadius: '50%', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', boxShadow: '0 8px 24px rgba(59,130,246,0.3)' }}>
            <DiceAvatar seed={displayEmail} size={90} sx={{ border: '3px solid', borderColor: 'background.paper' }} />
          </Box>
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h3" fontWeight={850} sx={{ mb: 0.5, letterSpacing: '-0.02em' }}>
              ¡Hola de nuevo, {userName}!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, maxWidth: 600 }}>
              Aquí tienes el resumen actualizado de tu actividad, solicitudes pendientes y beneficios disponibles hoy en Forza.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Chip 
                icon={<SecurityIcon sx={{ fontSize: 16 }} />} 
                label="Portal Colaborador" 
                size="small"
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 650, borderRadius: 1.5 }}
              />
              <Chip 
                label="Sesión Segura" 
                size="small"
                color="success" 
                sx={{ fontWeight: 600, borderRadius: 1.5 }}
              />
            </Box>
          </Box>
        </Box>
        
        {/* Background Decorative Circles */}
        <Box sx={{
          position: 'absolute', right: -60, top: -60, width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(255,255,255,0) 70%)', zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute', right: 120, bottom: -80, width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(255,255,255,0) 70%)', zIndex: 0
        }} />
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              icon={<AssignmentIcon sx={{ fontSize: 28 }} />}
              title="Solicitudes Pendientes"
              value={data?.pendingRequestsCount ?? 0}
              color="#ed6c02"
            />
          )}
        </Grid>
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              icon={<DescriptionIcon sx={{ fontSize: 28 }} />}
              title="Documentos Disponibles"
              value={data?.recentDocuments?.length ?? 0}
              color="#1565c0"
            />
          )}
        </Grid>
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
          {loading ? (
            <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
          ) : (
            <StatCard
              icon={<CampaignIcon sx={{ fontSize: 28 }} />}
              title="Comunicados Activos"
              value={data?.activeAnnouncements?.length ?? 0}
              color="#7b1fa2"
            />
          )}
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <Paper sx={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
            backdropFilter: 'blur(12px)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: 3,
            height: '100%',
          }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CampaignIcon color="primary" /> Comunicados Recientes
            </Typography>
            {loading ? (
              <Skeleton variant="rounded" height={220} sx={{ borderRadius: 2 }} />
            ) : data?.activeAnnouncements?.length > 0 ? (
              data.activeAnnouncements.slice(0, 3).map((a, i) => (
                <Box key={i} sx={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(59,130,246,0.01))',
                  border: '1px solid',
                  borderColor: 'rgba(59,130,246,0.15)',
                  borderLeft: '4px solid',
                  borderLeftColor: 'primary.main',
                  borderRadius: 2,
                  mb: 2,
                  p: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    transform: 'translateX(4px)',
                    borderColor: 'rgba(59,130,246,0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  },
                }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.primary">{a.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                    {a.body?.length > 120 ? `${a.body.substring(0, 120)}...` : a.body}
                  </Typography>
                  <Typography variant="caption" color="primary.main" sx={{ display: 'block', mt: 1, fontWeight: 600 }}>
                    {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No hay comunicados recientes por mostrar.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <Paper sx={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
            backdropFilter: 'blur(12px)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: 3,
            height: '100%',
          }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="secondary" /> Resumen de Beneficios
            </Typography>
            {loading ? (
              <Skeleton variant="rounded" height={220} sx={{ borderRadius: 2 }} />
            ) : data?.availableBenefits?.length > 0 ? (
              data.availableBenefits.slice(0, 3).map((b, i) => (
                <Box key={i} sx={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(139,92,246,0.01))',
                  border: '1px solid',
                  borderColor: 'rgba(139,92,246,0.15)',
                  borderLeft: '4px solid',
                  borderLeftColor: 'secondary.main',
                  borderRadius: 2,
                  mb: 2,
                  p: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    transform: 'translateX(4px)',
                    borderColor: 'rgba(139,92,246,0.3)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  },
                }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.primary">{b.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                    {b.description?.length > 120 ? `${b.description.substring(0, 120)}...` : b.description}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No hay beneficios activos en este momento.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
