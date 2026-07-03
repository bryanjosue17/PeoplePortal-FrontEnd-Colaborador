import AssignmentIcon from '@mui/icons-material/Assignment';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import {
  Box, Button, Card, CardContent, Chip, FormControl, Grid,
  InputLabel, MenuItem, Paper, Select, Skeleton, Tab, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  Tabs, TextField, Typography
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { cancelRequest, createCertificate, createVacation, createVoucher, getMyRequests } from '../../api/requests';

const statusColors = {
  Approved: 'success', Aprobado: 'success', Cancelado: 'default', Cancelled: 'default', Enviado: 'info', InReview: 'warning', Pendiente: 'warning', Pending: 'warning', Rechazado: 'error', Rejected: 'error', Submitted: 'info'
};

const statusLabels = {
  Approved: 'Aprobado', Cancelled: 'Cancelado', InReview: 'En Revisión', Pending: 'Pendiente', Rejected: 'Rechazado', Submitted: 'Enviado'
};

const getTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const vacationSchema = yup.object({
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
  startDate: yup
    .string()
    .required('Requerido')
    .test('min-date', 'La fecha de inicio debe ser a partir de mañana', (val) => {
      if (!val) return false;
      return val >= getTomorrow();
    }),
});

const certificateSchema = yup.object({
  certificateType: yup.string().required('Requerido'),
  estimatedDate: yup.string(),
  reason: yup.string().required('Requerido'),
});

const voucherSchema = yup.object({
  period: yup.string().required('Requerido'),
  reason: yup.string().required('Requerido'),
  year: yup.string().required('Requerido'),
});

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pb: 3, pt: 2, px: 3 }}>{children}</Box> : null;
}

function RequestForm({ type, onSubmit, loading }) {
  const schemas = { certificate: certificateSchema, vacation: vacationSchema, voucher: voucherSchema };
  const initial = { certificate: { certificateType: '', estimatedDate: '', reason: '' }, vacation: { endDate: '', reason: '', startDate: '' }, voucher: { period: '', reason: '', year: '' } };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initial[type] || {},
    onSubmit: (values) => {
      onSubmit(values);
      formik.resetForm();
    },
    validationSchema: schemas[type],
  });

  return (
    <Card sx={{ mb: 3, p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Nueva Solicitud de {type === 'vacation' ? 'Vacaciones' : type === 'certificate' ? 'Constancia' : 'Voucher'}
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          {type === 'vacation' && (
            <>
              <Grid size={{ sm: 6, xs: 12 }}>
                <TextField fullWidth label="Fecha de Inicio" type="date" name="startDate"
                  value={formik.values.startDate} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                  helperText={formik.touched.startDate && formik.errors.startDate}
                  required slotProps={{ htmlInput: { min: getTomorrow() }, inputLabel: { shrink: true } }} />
              </Grid>
              <Grid size={{ sm: 6, xs: 12 }}>
                <TextField fullWidth label="Fecha de Fin" type="date" name="endDate"
                  value={formik.values.endDate} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                  helperText={formik.touched.endDate && formik.errors.endDate}
                  required slotProps={{ htmlInput: { min: formik.values.startDate || getTomorrow() }, inputLabel: { shrink: true } }} />
              </Grid>
            </>
          )}
          {type === 'certificate' && (
            <>
              <Grid size={{ sm: 6, xs: 12 }}>
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
              <Grid size={{ sm: 6, xs: 12 }}>
                <TextField fullWidth label="Fecha Estimada" type="date" name="estimatedDate"
                  value={formik.values.estimatedDate} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  slotProps={{ inputLabel: { shrink: true } }} />
              </Grid>
            </>
          )}
          {type === 'voucher' && (
            <>
              <Grid size={{ sm: 6, xs: 12 }}>
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
              <Grid size={{ sm: 6, xs: 12 }}>
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
  const [requests, setRequests]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
      if (type === 'vacation') {await createVacation(data);}
      else if (type === 'certificate') {await createCertificate(data);}
      else if (type === 'voucher') {await createVoucher({ ...data, period: `${data.period} ${data.year}` });}
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
  const tabFiltered = reqList.filter(r => {
    const type = r.type?.toLowerCase() || r.requestType?.toLowerCase() || '';
    if (tab === 0) {return type === 'vacation' || type === 'vacaciones';}
    if (tab === 1) {return type === 'certificate' || type === 'constancia' || type === 'constancias';}
    if (tab === 2) {return type === 'voucher' || type === 'vale' || type === 'vouchers';}
    return true;
  });
  const filteredReqs = statusFilter
    ? tabFiltered.filter(r => r.status === statusFilter)
    : tabFiltered;
  const paginatedReqs = filteredReqs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 3 }}>
        <AssignmentIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>Solicitudes</Typography>
      </Box>

      <Paper sx={{ borderRadius: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ pt: 1, px: 2 }}>
          {tabs.map(t => <Tab key={t} label={t} />)}
        </Tabs>

        <Box sx={{ pb: 3 }}>
          {tabs.map((_, i) => (
            <TabPanel key={i} value={tab} index={i}>
              <RequestForm type={formTypes[i]} onSubmit={(data) => handleCreate(formTypes[i], data)} loading={submitting} />

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Mis {tabs[i]}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <TextField select size="small" label="Filtrar por estado" value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
                  sx={{ minWidth: 180 }}>
                  <MenuItem value="">Todos los estados</MenuItem>
                  <MenuItem value="Submitted">Enviado</MenuItem>
                  <MenuItem value="InReview">En Revisión</MenuItem>
                  <MenuItem value="Approved">Aprobado</MenuItem>
                  <MenuItem value="Rejected">Rechazado</MenuItem>
                  <MenuItem value="Cancelled">Cancelado</MenuItem>
                </TextField>
              </Box>

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
                  <CardContent sx={{ py: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">No hay solicitudes de {tabs[i].toLowerCase()}.</Typography>
                  </CardContent>
                </Card>
              ) : (
                <>
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Detalle</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Acción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedReqs.map(r => (
                        <TableRow key={r.id} hover>
                          <TableCell>{r.createdAtUtc ? new Date(r.createdAtUtc).toLocaleDateString('es-GT') : '-'}</TableCell>
                          <TableCell>
                            {r.reason || r.startDate
                              ? `${r.startDate || ''} ${r.endDate ? `- ${  r.endDate}` : ''} ${r.certificateType || r.period || ''} ${r.year || ''}`
                              : 'Sin detalle'}
                            <Typography variant="caption" display="block" color="text.secondary">
                              {r.reason?.substring(0, 60)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={statusLabels[r.status] ?? (r.status || 'Pendiente')} size="small" color={statusColors[r.status] || 'default'} />
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
                {filteredReqs.length > rowsPerPage && (
                  <TablePagination
                    component="div"
                    count={filteredReqs.length}
                    page={page}
                    onPageChange={(_, p) => setPage(p)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="Por página:"
                  />
                )}
                </>
              )}
            </TabPanel>
          ))}
        </Box>
      </Paper>

    </Box>
  );
}

export default Requests;
