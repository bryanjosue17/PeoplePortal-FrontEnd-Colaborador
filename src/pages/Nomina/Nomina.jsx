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
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 3 }}>
        <MonetizationOnIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>Mis Comprobantes de Nómina</Typography>
      </Box>

      {/* KPI summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ md: 4, xs: 12 }}>
          <Card sx={{ borderLeft: '3px solid', borderLeftColor: 'primary.main' }}>
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="h4" fontWeight={700}>{records.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total registros</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ md: 4, xs: 12 }}>
          <Card sx={{ borderLeft: '3px solid #34D399' }}>
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="h4" fontWeight={700} color="success.main">{available}</Typography>
              <Typography variant="body2" color="text.secondary">Disponibles para descarga</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ md: 4, xs: 12 }}>
          <Card sx={{ borderLeft: '3px solid #F59E0B' }}>
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {records.filter(r => r.status === 'Requested' || r.status === 'InProcess').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">En procesamiento</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter */}
      <Box sx={{ mb: 2 }}>
        <TextField select size="small" label="Filtrar por tipo" value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)} sx={{ minWidth: 220 }}>
          <MenuItem value="">Todos los tipos</MenuItem>
          {Object.entries(NOMINA_TYPE_LABELS).map(([v, l]) => (
            <MenuItem key={v} value={v}>{l}</MenuItem>
          ))}
        </TextField>
      </Box>

      {filtered.length === 0 ? (
        <Card>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <ReceiptLongIcon sx={{ color: 'text.disabled', fontSize: 48, mb: 2 }} />
            <Typography color="text.secondary">
              {typeFilter ? 'No hay comprobantes del tipo seleccionado.' : 'No tienes comprobantes de nómina disponibles.'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto' }}>
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
              {filtered.map(r => (
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Nomina;
