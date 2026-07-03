import AssignmentIcon from '@mui/icons-material/Assignment';
import CampaignIcon from '@mui/icons-material/Campaign';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import { Alert, Box, Card, CardContent, Grid, Paper, Skeleton, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';
import { getDashboard } from '../../api/dashboard';

function StatCard({ icon, title, value, color }) {
  return (
    <Card sx={{
      borderLeft: `3px solid ${color}`,
      height: '100%',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': { transform: 'translateY(-2px)' },
    }}>
      <CardContent sx={{ alignItems: 'center', display: 'flex', gap: 2 }}>
        <Box sx={{
          alignItems: 'center',
          bgcolor: alpha(color, 0.12),
          borderRadius: 2,
          color,
          display: 'flex',
          justifyContent: 'center',
          p: 1.5,
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={700}>{value}</Typography>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { keycloak } = useKeycloak();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboard()
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const token = keycloak?.tokenParsed;
  const userName = token?.name || token?.preferred_username || 'Usuario';

  if (error) {
    return (
      <>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1.5, mb: 3 }}>
          <DashboardIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight={600}>Bienvenido, {userName}</Typography>
            <Typography variant="body2" color="text.secondary">Panel de control del colaborador</Typography>
          </Box>
        </Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          No se pudieron cargar los datos del dashboard. Algunas funciones pueden no estar disponibles.
        </Alert>
        <Grid container spacing={3}>
          <Grid size={{ md: 4, sm: 6, xs: 12 }}>
            <StatCard icon={<AssignmentIcon />} title="Solicitudes Pendientes" value="--" color="#ed6c02" />
          </Grid>
          <Grid size={{ md: 4, sm: 6, xs: 12 }}>
            <StatCard icon={<DescriptionIcon />} title="Documentos Disponibles" value="--" color="#1565c0" />
          </Grid>
          <Grid size={{ md: 4, sm: 6, xs: 12 }}>
            <StatCard icon={<CampaignIcon />} title="Comunicados Activos" value="--" color="#7b1fa2" />
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1.5, mb: 3 }}>
        <DashboardIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h5" fontWeight={600}>Bienvenido, {userName}</Typography>
          <Typography variant="body2" color="text.secondary">Panel de control del colaborador</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
          {loading ? (
            <Skeleton variant="rounded" height={100} />
          ) : (
            <StatCard
              icon={<AssignmentIcon />}
              title="Solicitudes Pendientes"
              value={data?.pendingRequestsCount ?? 0}
              color="#ed6c02"
            />
          )}
        </Grid>
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
          {loading ? (
            <Skeleton variant="rounded" height={100} />
          ) : (
            <StatCard
              icon={<DescriptionIcon />}
              title="Documentos Disponibles"
              value={data?.recentDocuments?.length ?? 0}
              color="#1565c0"
            />
          )}
        </Grid>
        <Grid size={{ md: 4, sm: 6, xs: 12 }}>
          {loading ? (
            <Skeleton variant="rounded" height={100} />
          ) : (
            <StatCard
              icon={<CampaignIcon />}
              title="Comunicados Activos"
              value={data?.activeAnnouncements?.length ?? 0}
              color="#7b1fa2"
            />
          )}
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <Paper sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Comunicados Recientes
            </Typography>
            {loading ? (
              <Skeleton variant="rounded" height={200} />
            ) : data?.activeAnnouncements?.length > 0 ? (
              data.activeAnnouncements.slice(0, 3).map((a, i) => (
                <Box key={i} sx={{
                  borderLeft: '3px solid',
                  borderLeftColor: 'primary.main',
                  borderRadius: '0 8px 8px 0',
                  mb: 1.5,
                  p: 2,
                  bgcolor: 'action.hover',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: 'action.selected' },
                }}>
                  <Typography variant="subtitle2" fontWeight={600}>{a.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {a.body?.length > 120 ? `${a.body.substring(0, 120)}...` : a.body}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                    {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay comunicados recientes.
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid size={{ md: 6, xs: 12 }}>
          <Paper sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Resumen de Beneficios
            </Typography>
            {loading ? (
              <Skeleton variant="rounded" height={200} />
            ) : data?.availableBenefits?.length > 0 ? (
              data.availableBenefits.slice(0, 3).map((b, i) => (
                <Box key={i} sx={{
                  borderLeft: '3px solid',
                  borderLeftColor: 'secondary.main',
                  borderRadius: '0 8px 8px 0',
                  mb: 1.5,
                  p: 2,
                  bgcolor: 'action.hover',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: 'action.selected' },
                }}>
                  <Typography variant="subtitle2" fontWeight={600}>{b.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {b.description?.length > 120 ? `${b.description.substring(0, 120)}...` : b.description}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay beneficios activos.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
