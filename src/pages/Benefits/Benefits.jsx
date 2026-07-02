import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import {
  Alert, Box, Card, CardContent, Chip, Grid,
  Skeleton, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getActiveBenefits } from '../../api/benefits';

const typeColors = {
  'Alimentación': 'success',
  Bienestar: 'secondary',
  'Educación': 'primary',
  Otro: 'default',
  Salud: 'error',
  Transporte: 'warning',
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
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <CardGiftcardIcon sx={{ color: 'text.disabled', fontSize: 48, mb: 2 }} />
            <Typography color="text.secondary">No hay beneficios disponibles en este momento.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {list.map((b) => (
            <Grid size={{ md: 4, sm: 6, xs: 12 }} key={b.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 1 }}>
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
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 4,
                    display: '-webkit-box',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {b.description || ''}
                  </Typography>
                  {b.requirements && (
                    <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1 }}>
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
