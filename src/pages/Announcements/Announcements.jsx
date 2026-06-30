import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip, Skeleton, Alert, Paper
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import { getActiveAnnouncements } from '../../api/announcements';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getActiveAnnouncements()
      .then(res => setAnnouncements(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={600} gutterBottom>Comunicados</Typography>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton variant="rounded" height={180} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={600} gutterBottom>Comunicados</Typography>
        <Alert severity="error">Error al cargar comunicados: {error}</Alert>
      </Box>
    );
  }

  const list = Array.isArray(announcements) ? announcements : (announcements?.content || []);

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>Comunicados</Typography>

      {list.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CampaignIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">No hay comunicados activos en este momento.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {list.map((a) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={a.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={a.type || 'General'}
                      size="small"
                      color={a.type === 'Urgente' || a.type === 'Important' ? 'error' : 'primary'}
                      variant="outlined"
                    />
                    {a.publishedAt && (
                      <Typography variant="caption" color="text.disabled">
                        {new Date(a.publishedAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {a.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {a.body || a.description || ''}
                  </Typography>
                  {a.author && (
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                      Por: {a.author}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Announcements;
