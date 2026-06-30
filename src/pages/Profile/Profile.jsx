import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, TextField, Button, Card, CardContent, Skeleton, Alert, Chip, Avatar, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { getMyProfile, updateMyProfile } from '../../api/employees';

const validationSchema = yup.object({
  phone: yup.string(),
  site: yup.string(),
  emergencyContact: yup.string(),
  emergencyPhone: yup.string(),
});

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  const formik = useFormik({
    initialValues: { phone: '', emergencyContact: '', emergencyPhone: '', site: '' },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await updateMyProfile(values);
        setProfile(res.data);
        setEditing(false);
        toast.success('Perfil actualizado exitosamente');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error al actualizar perfil');
      }
    },
  });

  useEffect(() => {
    getMyProfile()
      .then(res => {
        const p = res.data;
        setProfile(p);
        formik.setValues({
          phone: p.phone || '',
          emergencyContact: p.emergencyContact || '',
          emergencyPhone: p.emergencyPhone || '',
          site: p.site || '',
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = () => {
    formik.setValues({
      phone: profile?.phone || '',
      emergencyContact: profile?.emergencyContact || '',
      emergencyPhone: profile?.emergencyPhone || '',
      site: profile?.site || '',
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
        <Grid item xs={12} md={8} sx={{ '& .MuiCard-root': { height: '100%' } }}>
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
              {!editing && (
                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditing(true)}>
                  Editar
                </Button>
              )}
            </Box>

            <Box component="form" onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} lg={6}>
                  <TextField fullWidth label="Teléfono" name="phone" value={formik.values.phone}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                    disabled={!editing}
                    InputProps={{ startAdornment: <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} /> }} />
                </Grid>
                <Grid item xs={12} sm={12} lg={6}>
                  <TextField fullWidth label="Sitio / Ubicación" name="site" value={formik.values.site}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.site && Boolean(formik.errors.site)}
                    helperText={formik.touched.site && formik.errors.site}
                    disabled={!editing}
                    InputProps={{ startAdornment: <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} /> }} />
                </Grid>
                <Grid item xs={12} sm={12} lg={6}>
                  <TextField fullWidth label="Contacto de Emergencia" name="emergencyContact" value={formik.values.emergencyContact}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.emergencyContact && Boolean(formik.errors.emergencyContact)}
                    helperText={formik.touched.emergencyContact && formik.errors.emergencyContact}
                    disabled={!editing} />
                </Grid>
                <Grid item xs={12} sm={12} lg={6}>
                  <TextField fullWidth label="Teléfono de Emergencia" name="emergencyPhone" value={formik.values.emergencyPhone}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.emergencyPhone && Boolean(formik.errors.emergencyPhone)}
                    helperText={formik.touched.emergencyPhone && formik.errors.emergencyPhone}
                    disabled={!editing} />
                </Grid>
                {editing && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="contained" startIcon={<SaveIcon />} onClick={formik.handleSubmit} disabled={formik.isSubmitting}>
                        {formik.isSubmitting ? 'Guardando...' : 'Guardar'}
                      </Button>
                      <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel} disabled={formik.isSubmitting}>
                        Cancelar
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>

    </Box>
  );
}

export default Profile;
