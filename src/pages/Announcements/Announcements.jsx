import CampaignIcon from '@mui/icons-material/Campaign';
import {
  Alert, Box, Card, CardContent, Chip, Grid,
  Skeleton, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
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
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 3 }}>
          <CampaignIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>Comunicados</Typography>
        </Box>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid size={{ md: 4, sm: 6, xs: 12 }} key={i}>
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
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 3 }}>
          <CampaignIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>Comunicados</Typography>
        </Box>
        <Alert severity="error">Error al cargar comunicados: {error}</Alert>
      </Box>
    );
  }

  const list = Array.isArray(announcements) ? announcements : (announcements?.content || []);

  return (
    <Box>
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 3 }}>
        <CampaignIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>Comunicados</Typography>
      </Box>

      {list.length === 0 ? (
        <Card>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <CampaignIcon sx={{ color: 'text.disabled', fontSize: 48, mb: 2 }} />
            <Typography color="text.secondary">No hay comunicados activos en este momento.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {list.map((a) => (
            <Grid size={{ md: 4, sm: 6, xs: 12 }} key={a.id}>
              <Card sx={{
                borderTop: `3px solid ${a.type === 'Urgente' || a.type === 'Important' ? '#f44336' : '#60A5FA'}`,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)' },
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
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
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 4,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {a.body || a.description || ''}
                  </Typography>
                  {a.author && (
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
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
