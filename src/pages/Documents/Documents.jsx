import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert, Box, Card, CardContent, Chip, InputAdornment, Paper,
  Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography
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

  return (
    <Box>
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, mb: 3 }}>
        <DescriptionIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>Mis Documentos</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth size="small" placeholder="Buscar por nombre o tipo..."
          value={search} onChange={e => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.disabled' }} /></InputAdornment> } }}
        />
      </Box>

      {filtered.length === 0 ? (
        <Card>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <DescriptionIcon sx={{ color: 'text.disabled', fontSize: 48, mb: 2 }} />
            <Typography color="text.secondary">{search ? 'No se encontraron documentos con ese criterio.' : 'No tienes documentos disponibles.'}</Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: 'auto' }}>
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
              {filtered.map((doc) => (
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Documents;
