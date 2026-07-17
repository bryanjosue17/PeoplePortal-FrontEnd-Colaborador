import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import {
  Alert, Box, Card, CardContent, Chip, Grid, Paper,
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
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 3 }}>
          <CardGiftcardIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>Beneficios</Typography>
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
          <CardGiftcardIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>Beneficios</Typography>
        </Box>
        <Alert severity="error">Error al cargar beneficios: {error}</Alert>
      </Box>
    );
  }

  const list = Array.isArray(benefits) ? benefits : (benefits?.content || []);

  return (
    <Box>
      {/* Glassmorphic Header Banner */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.06) 100%)',
          backdropFilter: 'blur(16px)',
          borderRadius: 3,
          mb: 4,
          p: { xs: 2.5, md: 3.5 },
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          borderLeft: '5px solid #3B82F6',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
          <Box sx={{ p: 1.5, borderRadius: 2.5, background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', color: '#fff', display: 'flex', boxShadow: '0 6px 16px rgba(59,130,246,0.3)' }}>
            <CardGiftcardIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800}>Mis Beneficios</Typography>
            <Typography variant="body2" color="text.secondary">Descubre e infórmate sobre las prestaciones empresariales y seguros a tu disposición</Typography>
          </Box>
        </Box>
        <Box sx={{
          position: 'absolute', right: -40, top: -40, width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(255,255,255,0) 70%)', zIndex: 0
        }} />
      </Paper>

      {list.length === 0 ? (
        <Card sx={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
          backdropFilter: 'blur(12px)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <CardGiftcardIcon sx={{ color: 'text.disabled', fontSize: 48, mb: 2 }} />
            <Typography color="text.secondary">No hay beneficios disponibles en este momento.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {list.map((b) => (
            <Grid size={{ md: 4, sm: 6, xs: 12 }} key={b.id}>
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)',
                backdropFilter: 'blur(12px)',
                border: '1px solid',
                borderColor: 'divider',
                borderTop: '4px solid #3B82F6',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' },
              }}>
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
