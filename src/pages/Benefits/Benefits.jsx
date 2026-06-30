import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Chip, Skeleton, Alert, Paper
} from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import { getActiveBenefits } from '../../api/benefits';

const typeColors = {
  Salud: 'error',
  'Educación': 'primary',
  'Alimentación': 'success',
  Transporte: 'warning',
  Bienestar: 'secondary',
  Otro: 'default',
};

function Benefits() {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getActiveBenefits()
      .then(res => setBenefits(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={600} gutterBottom>Beneficios</Typography>
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
        <Typography variant="h5" fontWeight={600} gutterBottom>Beneficios</Typography>
        <Alert severity="error">Error al cargar beneficios: {error}</Alert>
      </Box>
    );
  }

  const list = Array.isArray(benefits) ? benefits : (benefits?.content || []);

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>Beneficios</Typography>

      {list.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CardGiftcardIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">No hay beneficios disponibles en este momento.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {list.map((b) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={b.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={b.type || 'General'}
                      size="small"
                      color={typeColors[b.type] || 'default'}
                      variant="outlined"
                    />
                    {b.value && (
                      <Typography variant="caption" color="success.main" fontWeight={600}>
                        {b.value}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {b.name || b.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {b.description || ''}
                  </Typography>
                  {b.requirements && (
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                      Requisitos: {b.requirements}
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

export default Benefits;
