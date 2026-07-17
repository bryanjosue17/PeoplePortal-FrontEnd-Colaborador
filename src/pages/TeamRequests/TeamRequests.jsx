import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import GroupIcon from '@mui/icons-material/Group';
import {
  Alert, Box, Button, Card, CardContent, Chip, Dialog,
  DialogActions, DialogContent, DialogTitle, Skeleton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Paper,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getTeamRequests, approveTeamRequest } from '../../api/manager';

const statusColors  = { Approved: 'success', Cancelled: 'default', InReview: 'warning', Rejected: 'error', Submitted: 'info' };
const statusLabels  = { Approved: 'Aprobado', Cancelled: 'Cancelado', InReview: 'En Revisión', Rejected: 'Rechazado', Submitted: 'Enviado' };
const typeLabels    = { Certificate: 'Constancia', DataUpdate: 'Actualiz. Datos', Other: 'Otro', Permission: 'Permiso', Vacation: 'Vacaciones', Voucher: 'Voucher' };

export default function TeamRequests() {
  const [requests, setRequests]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [comment, setComment]         = useState('');
  const [submitting, setSubmitting]   = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getTeamRequests()
      .then(res => setRequests(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (status) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await approveTeamRequest(selected.id, { hrComment: comment });
      toast.success(`Solicitud ${status === 'Approved' ? 'aprobada' : 'rechazada'} exitosamente`);
      setSelected(null);
      setComment('');
      load();
    } catch {
      toast.error('Error al procesar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  const pending = requests.filter(r => r.status === 'Submitted' || r.status === 'InReview');
  const others  = requests.filter(r => r.status !== 'Submitted' && r.status !== 'InReview');

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
            <GroupIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800}>Mi Equipo</Typography>
            <Typography variant="body2" color="text.secondary">Solicitudes pendientes y gestión de aprobaciones de tu equipo a cargo</Typography>
          </Box>
        </Box>
        <Box sx={{
          position: 'absolute', right: -40, top: -40, width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(255,255,255,0) 70%)', zIndex: 0
        }} />
      </Paper>

      {pending.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Tienes <strong>{pending.length}</strong> solicitud{pending.length !== 1 ? 'es' : ''} pendiente{pending.length !== 1 ? 's' : ''} de revisión.
        </Alert>
      )}

      {loading ? (
        <Card><CardContent>{[...Array(3)].map((_, i) => <Skeleton key={i} variant="rounded" height={52} sx={{ mb: 1 }} />)}</CardContent></Card>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <GroupIcon sx={{ color: 'text.disabled', fontSize: 48, mb: 1 }} />
            <Typography color="text.secondary">No hay solicitudes de tu equipo aún.</Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {pending.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={700} color="warning.main" sx={{ mb: 1 }}>
                PENDIENTES DE REVISIÓN ({pending.length})
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)',
                backdropFilter: 'blur(12px)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflowX: 'auto',
              }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Empleado (ID)</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Detalle</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pending.map(r => (
                      <TableRow key={r.id} hover sx={{ cursor: 'pointer' }} onClick={() => { setSelected(r); setComment(''); }}>
                        <TableCell><Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>{r.employeeId?.substring(0, 12)}…</Typography></TableCell>
                        <TableCell>{typeLabels[r.type] ?? r.type}</TableCell>
                        <TableCell>
                          <Typography variant="body2">{r.vacationStartDate ? `${r.vacationStartDate} → ${r.vacationEndDate}` : r.certificateType || r.reason?.substring(0, 40) || '—'}</Typography>
                        </TableCell>
                        <TableCell><Chip label={statusLabels[r.status] ?? r.status} size="small" color={statusColors[r.status] || 'default'} /></TableCell>
                        <TableCell><Typography variant="caption" color="text.secondary">{r.createdAtUtc ? new Date(r.createdAtUtc).toLocaleDateString('es-GT') : '—'}</Typography></TableCell>
                        <TableCell onClick={e => e.stopPropagation()}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Button size="small" color="success" variant="outlined" startIcon={<CheckCircleIcon />}
                              onClick={() => { setSelected(r); setComment(''); }}>
                              Revisar
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {others.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                HISTORIAL ({others.length})
              </Typography>
              <TableContainer component={Paper} elevation={0} sx={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%)',
                backdropFilter: 'blur(12px)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflowX: 'auto',
              }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Comentario</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {others.slice(0, 20).map(r => (
                      <TableRow key={r.id} hover>
                        <TableCell>{typeLabels[r.type] ?? r.type}</TableCell>
                        <TableCell><Chip label={statusLabels[r.status] ?? r.status} size="small" color={statusColors[r.status] || 'default'} /></TableCell>
                        <TableCell><Typography variant="caption" color="text.secondary">{r.createdAtUtc ? new Date(r.createdAtUtc).toLocaleDateString('es-GT') : '—'}</Typography></TableCell>
                        <TableCell><Typography variant="caption" color="text.disabled">{r.hrComment || '—'}</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </>
      )}

      {/* Review dialog */}
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Revisar Solicitud</DialogTitle>
        <DialogContent>
          {selected && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Tipo</Typography>
                  <Typography fontWeight={600}>{typeLabels[selected.type] ?? selected.type}</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">Estado actual</Typography>
                  <Typography><Chip label={statusLabels[selected.status] ?? selected.status} size="small" color={statusColors[selected.status] || 'default'} /></Typography>
                </Box>
              </Box>
              {selected.vacationStartDate && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Período</Typography>
                  <Typography>{selected.vacationStartDate} → {selected.vacationEndDate}</Typography>
                </Box>
              )}
              {selected.reason && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Motivo</Typography>
                  <Typography variant="body2">{selected.reason}</Typography>
                </Box>
              )}
              <TextField
                fullWidth multiline rows={3}
                label="Comentario (opcional)"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Agregar comentario para el colaborador..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ gap: 1, pb: 2, px: 3 }}>
          <Button onClick={() => setSelected(null)} disabled={submitting}>Cancelar</Button>
          <Button color="error" variant="outlined" startIcon={<CancelIcon />}
            disabled={submitting} onClick={() => handleAction('Rejected')}>
            Rechazar
          </Button>
          <Button color="success" variant="contained" startIcon={<CheckCircleIcon />}
            disabled={submitting} onClick={() => handleAction('Approved')}>
            {submitting ? 'Procesando...' : 'Aprobar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
