import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  Alert, Box, Card, CardContent, Chip, Grid,
  Paper, Skeleton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, MenuItem, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getMyNomina } from '../../api/nomina';

const NOMINA_TYPE_LABELS = {
  ComprobanteDepago: 'Comprobante de Pago',
  Bonificacion:      'Bonificación',
  Adelanto:          'Adelanto de Salario',
  Aguinaldo:         'Aguinaldo',
  Vacaciones:        'Vacaciones',
  Otro:              'Otro',
};
const TYPE_COLORS = {
  ComprobanteDepago: 'primary', Bonificacion: 'success', Adelanto: 'warning',
  Aguinaldo: 'secondary', Vacaciones: 'info', Otro: 'default',
};
const STATUS_COLORS  = {
  AvailableForDownload: 'success', Completed: 'default',
  InProcess: 'info', Rejected: 'error', Requested: 'warning',
};
const STATUS_LABELS  = {
  AvailableForDownload: 'Disponible para descarga',
  Completed: 'Completado', InProcess: 'En Proceso',
  Rejected: 'Rechazado',   Requested: 'Solicitado',
};

function Nomina() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    getMyNomina()
      .then(res => setRecords(Array.isArray(res.data) ? res.data : []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 3 }}>
          <MonetizationOnIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>Mis Comprobantes de Nómina</Typography>
        </Box>
        <Card><CardContent>
          {[...Array(4)].map((_, i) => <Skeleton key={i} variant="rounded" height={52} sx={{ mb: 1 }} />)}
        </CardContent></Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 3 }}>
          <MonetizationOnIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>Mis Comprobantes de Nómina</Typography>
        </Box>
        <Alert severity="error">Error al cargar comprobantes: {error}</Alert>
      </Box>
    );
  }

  const filtered = typeFilter ? records.filter(r => r.nominaType === typeFilter) : records;
  const available = records.filter(r => r.status === 'AvailableForDownload').length;

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
            <MonetizationOnIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800}>Mis Comprobantes de Nómina</Typography>
            <Typography variant="body2" color="text.secondary">Revisa el historial de tus recibos de nómina y descárgalos fácilmente</Typography>
          </Box>
        </Box>
        <Box sx={{
          position: 'absolute', right: -40, top: -40, width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(255,255,255,0) 70%)', zIndex: 0
        }} />
      </Paper>

      {/* KPI summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ md: 4, xs: 12 }}>
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1px solid',
            borderColor: 'divider',
            borderTop: '4px solid #3B82F6',
            borderRadius: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-3px)' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h3" fontWeight={800}>{records.length}</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>Total registros</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ md: 4, xs: 12 }}>
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1px solid',
            borderColor: 'divider',
            borderTop: '4px solid #10B981',
            borderRadius: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-3px)' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h3" fontWeight={800} color="success.main">{available}</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>Disponibles para descarga</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ md: 4, xs: 12 }}>
          <Card sx={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)',
            backdropFilter: 'blur(12px)',
            border: '1px solid',
            borderColor: 'divider',
            borderTop: '4px solid #F59E0B',
            borderRadius: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-3px)' }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h3" fontWeight={800} color="warning.main">
                {records.filter(r => r.status === 'Requested' || r.status === 'InProcess').length}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>En procesamiento</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
          backdropFilter: 'blur(12px)',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          p: 2.5,
          mb: 3,
        }}
      >
        <TextField select size="small" label="Filtrar por tipo" value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)} sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
          <MenuItem value="">Todos los tipos</MenuItem>
          {Object.entries(NOMINA_TYPE_LABELS).map(([v, l]) => (
            <MenuItem key={v} value={v}>{l}</MenuItem>
          ))}
        </TextField>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)',
        backdropFilter: 'blur(12px)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflowX: 'auto',
      }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Período</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Notas</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Archivo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <ReceiptLongIcon sx={{ color: 'text.disabled', fontSize: 48, mb: 2 }} />
                    <Typography color="text.secondary">
                      {typeFilter ? 'No hay comprobantes del tipo seleccionado.' : 'No tienes comprobantes de nómina disponibles.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(r => (
                  <TableRow key={r.id} hover>
                    <TableCell><Typography fontWeight={500}>{r.period}</Typography></TableCell>
                    <TableCell>
                      <Chip label={NOMINA_TYPE_LABELS[r.nominaType] ?? r.nominaType}
                        size="small" color={TYPE_COLORS[r.nominaType] ?? 'default'} />
                    </TableCell>
                    <TableCell>
                      <Chip label={STATUS_LABELS[r.status] ?? r.status}
                        size="small" color={STATUS_COLORS[r.status] ?? 'default'} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">{r.notes || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {r.requestedAt ? new Date(r.requestedAt).toLocaleDateString('es-GT') : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {r.fileUrl
                        ? <Typography component="a" href={r.fileUrl} target="_blank" rel="noopener noreferrer"
                            variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                            Descargar
                          </Typography>
                        : <Typography variant="caption" color="text.disabled">Pendiente</Typography>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
    </Box>
  );
}

export default Nomina;
