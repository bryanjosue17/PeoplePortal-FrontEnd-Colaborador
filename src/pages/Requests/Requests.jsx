import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Select, MenuItem, FormControl,
  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Tabs, Tab, Card, CardContent, Grid, Alert, Skeleton
} from '@mui/material';
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { getMyRequests, createVacation, createCertificate, createVoucher, cancelRequest } from '../../api/requests';

const statusColors = {
  Submitted: 'info', Enviado: 'info',
  Approved: 'success', Aprobado: 'success',
  Rejected: 'error', Rechazado: 'error',
  Cancelled: 'default', Cancelado: 'default',
  Pending: 'warning', Pendiente: 'warning',
};

const getTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const vacationSchema = yup.object({
  startDate: yup
    .string()
    .required('Requerido')
    .test('min-date', 'La fecha de inicio debe ser a partir de mañana', (val) => {
      if (!val) return false;
      return val >= getTomorrow();
    }),
  endDate: yup
    .string()
    .required('Requerido')
    .test('min-date', 'La fecha de fin debe ser a partir de mañana', (val) => {
      if (!val) return false;
      return val >= getTomorrow();
    })
    .test('after-start', 'La fecha de fin debe ser igual o posterior al inicio', function (val) {
      const { startDate } = this.parent;
      if (!val || !startDate) return true;
      return val >= startDate;
    }),
  reason: yup.string().required('Requerido'),
});

const certificateSchema = yup.object({
  certificateType: yup.string().required('Requerido'),
  estimatedDate: yup.string(),
  reason: yup.string().required('Requerido'),
});

const voucherSchema = yup.object({
  period: yup.string().required('Requerido'),
  year: yup.string().required('Requerido'),
  reason: yup.string().required('Requerido'),
});

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ px: 3, pb: 3, pt: 2 }}>{children}</Box> : null;
}

function RequestForm({ type, onSubmit, loading }) {
  const schemas = { vacation: vacationSchema, certificate: certificateSchema, voucher: voucherSchema };
  const initial = { vacation: { startDate: '', endDate: '', reason: '' }, certificate: { certificateType: '', estimatedDate: '', reason: '' }, voucher: { period: '', year: '', reason: '' } };

  const formik = useFormik({
    initialValues: initial[type] || {},
    validationSchema: schemas[type],
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
    enableReinitialize: true,
  });

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Nueva Solicitud de {type === 'vacation' ? 'Vacaciones' : type === 'certificate' ? 'Constancia' : 'Voucher'}
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {type === 'vacation' && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Fecha de Inicio" type="date" name="startDate"
                  value={formik.values.startDate} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                  helperText={formik.touched.startDate && formik.errors.startDate}
                  required slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: getTomorrow() } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Fecha de Fin" type="date" name="endDate"
                  value={formik.values.endDate} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                  helperText={formik.touched.endDate && formik.errors.endDate}
                  required slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: formik.values.startDate || getTomorrow() } }} />
              </Grid>
            </>
          )}
          {type === 'certificate' && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required error={formik.touched.certificateType && Boolean(formik.errors.certificateType)}>
                  <InputLabel>Tipo de Constancia</InputLabel>
                  <Select name="certificateType" value={formik.values.certificateType} onChange={formik.handleChange}
                    onBlur={formik.handleBlur} label="Tipo de Constancia">
                    <MenuItem value="Trabajo">Constancia de Trabajo</MenuItem>
                    <MenuItem value="Salario">Constancia de Salario</MenuItem>
                    <MenuItem value="Vacaciones">Constancia de Vacaciones</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                  </Select>
                </FormControl>
                {formik.touched.certificateType && formik.errors.certificateType && (
                  <Typography variant="caption" color="error">{formik.errors.certificateType}</Typography>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Fecha Estimada" type="date" name="estimatedDate"
                  value={formik.values.estimatedDate} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
            </>
          )}
          {type === 'voucher' && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required error={formik.touched.period && Boolean(formik.errors.period)}>
                  <InputLabel>Periodo</InputLabel>
                  <Select name="period" value={formik.values.period} onChange={formik.handleChange}
                    onBlur={formik.handleBlur} label="Periodo">
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
                {formik.touched.period && formik.errors.period && (
                  <Typography variant="caption" color="error">{formik.errors.period}</Typography>
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Año" type="number" name="year"
                  value={formik.values.year} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.year && Boolean(formik.errors.year)}
                  helperText={formik.touched.year && formik.errors.year} required />
              </Grid>
            </>
          )}
          <Grid size={12}>
            <TextField fullWidth label="Motivo" name="reason" multiline rows={3}
              value={formik.values.reason} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.reason && Boolean(formik.errors.reason)}
              helperText={formik.touched.reason && formik.errors.reason} required />
          </Grid>
          <Grid size={12}>
            <Button type="submit" variant="contained" startIcon={<SendIcon />} disabled={loading || formik.isSubmitting}>
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

function Requests() {
  const [tab, setTab] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
      else if (type === 'voucher') await createVoucher({ ...data, period: `${data.period} ${data.year}` });
      toast.success('Solicitud creada exitosamente');
      loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelRequest(id);
      toast.success('Solicitud cancelada');
      loadRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al cancelar');
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

        <Box sx={{ pb: 3 }}>
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
                          <TableCell>{r.createdAtUtc ? new Date(r.createdAtUtc).toLocaleDateString('es-GT') : '-'}</TableCell>
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

    </Box>
  );
}

export default Requests;
