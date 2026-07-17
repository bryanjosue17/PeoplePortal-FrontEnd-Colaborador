import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert, Box, Card, CardContent, Chip, InputAdornment, Paper,
  Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getMyDocuments } from '../../api/documents';

const statusColors = {
  Approved: 'success',
  Available: 'success',
  Disponible: 'success',
  Expirado: 'error',
  Expired: 'error',
  InReview: 'warning',
  Pendiente: 'warning',
  Pending: 'warning',
  Rechazado: 'error',
  Rejected: 'error'
};

const statusLabels = {
  Approved: 'Aprobado', Available: 'Disponible', Expired: 'Expirado', InReview: 'En Revisión', Pending: 'Pendiente', Rejected: 'Rechazado'
};

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getMyDocuments()
      .then(res => setDocuments(res.data || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 3 }}>
          <DescriptionIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>Mis Documentos</Typography>
        </Box>
        <Card>
          <CardContent>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} variant="rounded" height={52} sx={{ mb: 1 }} />
            ))}
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 3 }}>
          <DescriptionIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>Mis Documentos</Typography>
        </Box>
        <Alert severity="error">Error al cargar documentos: {error}</Alert>
      </Box>
    );
  }

  const docs = Array.isArray(documents) ? documents : (documents?.content || []);
  const filtered = search
    ? docs.filter(d =>
        (d.name || d.fileName || '').toLowerCase().includes(search.toLowerCase()) ||
        (d.type || d.documentType || '').toLowerCase().includes(search.toLowerCase())
      )
    : docs;
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
            <DescriptionIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800}>Mis Documentos</Typography>
            <Typography variant="body2" color="text.secondary">Consulta y descarga tus constancias, manuales y archivos personales</Typography>
          </Box>
        </Box>
        <Box sx={{
          position: 'absolute', right: -40, top: -40, width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(255,255,255,0) 70%)', zIndex: 0
        }} />
      </Paper>

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
        <TextField
          fullWidth size="small" placeholder="Buscar por nombre o tipo..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'primary.main' }} /></InputAdornment> } }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
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
                <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Subido</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <DescriptionIcon sx={{ color: 'text.disabled', fontSize: 48, mb: 2 }} />
                    <Typography color="text.secondary">{search ? 'No se encontraron documentos con ese criterio.' : 'No tienes documentos disponibles.'}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((doc) => (
                  <TableRow key={doc.id} hover>
                    <TableCell>{doc.name || doc.fileName || 'Sin nombre'}</TableCell>
                    <TableCell>
                      <Chip label={doc.type || doc.documentType || 'General'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[doc.status] ?? (doc.status || 'Pendiente')}
                        size="small"
                        color={statusColors[doc.status] || 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {doc.uploadedAt || doc.createdAt
                          ? new Date(doc.uploadedAt || doc.createdAt).toLocaleDateString()
                          : '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filtered.length > rowsPerPage && (
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Por página:"
          />
        )}
    </Box>
  );
}

export default Documents;
