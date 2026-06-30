import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Box, Grid, Paper, Typography, Card, CardContent, Skeleton, Alert } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import CampaignIcon from '@mui/icons-material/Campaign';
import { getDashboard } from '../../api/dashboard';

function StatCard({ icon, title, value, color }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}15`, color: color }}>
          {icon}
        </Paper>
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
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Bienvenido, {userName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Panel de control del colaborador
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          No se pudieron cargar los datos del dashboard. Algunas funciones pueden no estar disponibles.
        </Alert>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard icon={<AssignmentIcon />} title="Solicitudes Pendientes" value="--" color="#ed6c02" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard icon={<DescriptionIcon />} title="Documentos Disponibles" value="--" color="#1565c0" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard icon={<CampaignIcon />} title="Comunicados Activos" value="--" color="#7b1fa2" />
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Bienvenido, {userName}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Panel de control del colaborador
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {loading ? (
            <Skeleton variant="rounded" height={100} />
          ) : (
            <StatCard
              icon={<AssignmentIcon />}
              title="Solicitudes Pendientes"
              value={data?.pendingRequests ?? 0}
              color="#ed6c02"
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {loading ? (
            <Skeleton variant="rounded" height={100} />
          ) : (
            <StatCard
              icon={<DescriptionIcon />}
              title="Documentos Disponibles"
              value={data?.availableDocuments ?? 0}
              color="#1565c0"
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {loading ? (
            <Skeleton variant="rounded" height={100} />
          ) : (
            <StatCard
              icon={<CampaignIcon />}
              title="Comunicados Activos"
              value={data?.activeAnnouncements ?? 0}
              color="#7b1fa2"
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Comunicados Recientes
            </Typography>
            {loading ? (
              <Skeleton variant="rounded" height={200} />
            ) : data?.recentAnnouncements?.length > 0 ? (
              data.recentAnnouncements.map((a, i) => (
                <Paper key={i} variant="outlined" sx={{ p: 2, mb: 1, borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>{a.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {a.body?.length > 120 ? a.body.substring(0, 120) + '...' : a.body}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay comunicados recientes.
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Resumen de Beneficios
            </Typography>
            {loading ? (
              <Skeleton variant="rounded" height={200} />
            ) : data?.activeBenefits?.length > 0 ? (
              data.activeBenefits.map((b, i) => (
                <Paper key={i} variant="outlined" sx={{ p: 2, mb: 1, borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>{b.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {b.description?.length > 120 ? b.description.substring(0, 120) + '...' : b.description}
                  </Typography>
                </Paper>
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
