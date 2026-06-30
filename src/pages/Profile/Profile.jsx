import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, TextField, Button, Card, CardContent, Skeleton, Alert, Snackbar, Chip, Avatar, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { getMyProfile, updateMyProfile } from '../../api/employees';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [form, setForm] = useState({
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    site: ''
  });

  useEffect(() => {
    getMyProfile()
      .then(res => {
        const p = res.data;
        setProfile(p);
        setForm({
          phone: p.phone || '',
          emergencyContact: p.emergencyContact || '',
          emergencyPhone: p.emergencyPhone || '',
          site: p.site || ''
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateMyProfile(form);
      setProfile(res.data);
      setEditing(false);
      setSnackbar({ open: true, message: 'Perfil actualizado exitosamente', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Error al actualizar perfil', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      phone: profile?.phone || '',
      emergencyContact: profile?.emergencyContact || '',
      emergencyPhone: profile?.emergencyPhone || '',
      site: profile?.site || ''
    });
    setEditing(false);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error al cargar el perfil: {error}
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box>
        <Typography variant="h5" fontWeight={600} gutterBottom>Mi Perfil</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={300} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={300} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  const fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || profile?.email || 'Usuario';

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>Mi Perfil</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 3 }}>
            <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: 32 }}>
              {(profile?.firstName?.charAt(0) || 'U').toUpperCase()}
            </Avatar>
            <Typography variant="h6" fontWeight={600}>{fullName}</Typography>
            <Chip label={profile?.status || 'Activo'} color={profile?.status === 'Activo' ? 'success' : 'default'} size="small" sx={{ mt: 1 }} />
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <BadgeIcon fontSize="small" color="primary" />
                <Typography variant="body2">{profile?.documentType || ''}: {profile?.documentNumber || ''}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <EmailIcon fontSize="small" color="primary" />
                <Typography variant="body2">{profile?.email || ''}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon fontSize="small" color="primary" />
                <Typography variant="body2">{profile?.site || 'No asignado'}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>Información de Contacto</Typography>
              {!editing ? (
                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditing(true)}>
                  Editar
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel} disabled={saving}>
                    Cancelar
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  InputProps={{ startAdornment: <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sitio / Ubicación"
                  name="site"
                  value={form.site}
                  onChange={handleChange}
                  disabled={!editing}
                  InputProps={{ startAdornment: <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} /> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contacto de Emergencia"
                  name="emergencyContact"
                  value={form.emergencyContact}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono de Emergencia"
                  name="emergencyPhone"
                  value={form.emergencyPhone}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Profile;
