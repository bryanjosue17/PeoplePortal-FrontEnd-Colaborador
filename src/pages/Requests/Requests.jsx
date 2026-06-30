import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Select, MenuItem, FormControl,
  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Tabs, Tab, Card, CardContent, Grid, Alert, Snackbar, Skeleton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import { getMyRequests, createVacation, createCertificate, createVoucher, cancelRequest } from '../../api/requests';

const statusColors = {
  Submitted: 'info',
  Enviado: 'info',
  Approved: 'success',
  Aprobado: 'success',
  Rejected: 'error',
  Rechazado: 'error',
  Cancelled: 'default',
  Cancelado: 'default',
  Pending: 'warning',
  Pendiente: 'warning',
};

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

function RequestForm({ type, onSubmit, loading }) {
  const [form, setForm] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({});
  };

  if (type === 'vacation') {
    return (
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Nueva Solicitud de Vacaciones</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Fecha de Inicio" type="date" name="startDate"
                value={form.startDate || ''} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Fecha de Fin" type="date" name="endDate"
                value={form.endDate || ''} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Motivo" name="reason" multiline rows={3}
                value={form.reason || ''} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" startIcon={<SendIcon />} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    );
  }

  if (type === 'certificate') {
    return (
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Nueva Solicitud de Constancia</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Tipo de Constancia</InputLabel>
                <Select name="certificateType" value={form.certificateType || ''} onChange={handleChange} label="Tipo de Constancia">
                  <MenuItem value="Trabajo">Constancia de Trabajo</MenuItem>
                  <MenuItem value="Salario">Constancia de Salario</MenuItem>
                  <MenuItem value="Vacaciones">Constancia de Vacaciones</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Fecha Estimada" type="date" name="estimatedDate"
                value={form.estimatedDate || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Motivo" name="reason" multiline rows={3}
                value={form.reason || ''} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" startIcon={<SendIcon />} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    );
  }

  if (type === 'voucher') {
    return (
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Nueva Solicitud de Voucher</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Periodo</InputLabel>
                <Select name="period" value={form.period || ''} onChange={handleChange} label="Periodo">
                  <MenuItem value="Enero">Enero</MenuItem>
                  <MenuItem value="Febrero">Febrero</MenuItem>
                  <MenuItem value="Marzo">Marzo</MenuItem>
                  <MenuItem value="Abril">Abril</MenuItem>
                  <MenuItem value="Mayo">Mayo</MenuItem>
                  <MenuItem value="Junio">Junio</MenuItem>
                  <MenuItem value="Julio">Julio</MenuItem>
                  <MenuItem value="Agosto">Agosto</MenuItem>
                  <MenuItem value="Septiembre">Septiembre</MenuItem>
                  <MenuItem value="Octubre">Octubre</MenuItem>
                  <MenuItem value="Noviembre">Noviembre</MenuItem>
                  <MenuItem value="Diciembre">Diciembre</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Año" type="number" name="year"
                value={form.year || ''} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Motivo" name="reason" multiline rows={3}
                value={form.reason || ''} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" startIcon={<SendIcon />} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
    );
  }

  return null;
}

function Requests() {
  const [tab, setTab] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadRequests = () => {
    setLoading(true);
    getMyRequests()
      .then(res => setRequests(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRequests(); }, []);

  const handleCreate = async (type, data) => {
    setSubmitting(true);
    try {
      if (type === 'vacation') await createVacation(data);
      else if (type === 'certificate') await createCertificate(data);
      else if (type === 'voucher') await createVoucher(data);
      setSnackbar({ open: true, message: 'Solicitud creada exitosamente', severity: 'success' });
      loadRequests();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Error al crear solicitud', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelRequest(id);
      setSnackbar({ open: true, message: 'Solicitud cancelada', severity: 'success' });
      loadRequests();
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Error al cancelar', severity: 'error' });
    }
  };

  const formTypes = ['vacation', 'certificate', 'voucher'];
  const tabs = ['Vacaciones', 'Constancias', 'Vouchers'];

  const reqList = Array.isArray(requests) ? requests : (requests?.content || []);
  const filteredReqs = reqList.filter(r => {
    const type = r.type?.toLowerCase() || r.requestType?.toLowerCase() || '';
    if (tab === 0) return type === 'vacation' || type === 'vacaciones';
    if (tab === 1) return type === 'certificate' || type === 'constancia' || type === 'constancias';
    if (tab === 2) return type === 'voucher' || type === 'vale' || type === 'vouchers';
    return true;
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>Solicitudes</Typography>

      <Paper sx={{ borderRadius: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, pt: 1 }}>
          {tabs.map(t => <Tab key={t} label={t} />)}
        </Tabs>

        <Box sx={{ px: 3, pb: 3 }}>
          {tabs.map((_, i) => (
            <TabPanel key={i} value={tab} index={i}>
              <RequestForm type={formTypes[i]} onSubmit={(data) => handleCreate(formTypes[i], data)} loading={submitting} />

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Mis {tabs[i]}
              </Typography>

              {loading ? (
                <Card>
                  <CardContent>
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} variant="rounded" height={52} sx={{ mb: 1 }} />
                    ))}
                  </CardContent>
                </Card>
              ) : filteredReqs.length === 0 ? (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">No hay solicitudes de {tabs[i].toLowerCase()}.</Typography>
                  </CardContent>
                </Card>
              ) : (
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Detalle</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Acción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredReqs.map(r => (
                        <TableRow key={r.id} hover>
                          <TableCell>
                            {new Date(r.createdAt || r.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {r.reason || r.startDate
                              ? `${r.startDate || ''} ${r.endDate ? '- ' + r.endDate : ''} ${r.certificateType || r.period || ''} ${r.year || ''}`
                              : 'Sin detalle'}
                            <Typography variant="caption" display="block" color="text.secondary">
                              {r.reason?.substring(0, 60)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={r.status || 'Pending'} size="small" color={statusColors[r.status] || 'default'} />
                          </TableCell>
                          <TableCell>
                            {(r.status === 'Submitted' || r.status === 'Enviado' || r.status === 'Pending' || r.status === 'Pendiente') && (
                              <Button size="small" color="error" startIcon={<CancelIcon />}
                                onClick={() => handleCancel(r.id)}>
                                Cancelar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>
          ))}
        </Box>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Requests;
